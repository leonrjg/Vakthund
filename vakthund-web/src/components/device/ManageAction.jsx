import React, {useState} from "react";
import FormControl from '@mui/joy/FormControl';
import RadioGroup from '@mui/joy/RadioGroup';
import {Alert, Button, Card, CardContent, Checkbox, Input, List, ListItem, ListItemDecorator, Option, Select, Typography} from "@mui/joy";
import {Troubleshoot} from "@mui/icons-material";
import FormLabel from "@mui/joy/FormLabel";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {ACTION_URL, getActionURL} from "../../redux/types/Types";
import {useNavigate, useParams} from "react-router-dom";
import {useEffectOnce} from "react-use";
import {getDevices} from "../../redux/actions/Actions";
import Box from "@mui/material/Box";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-bash';
import 'prismjs/themes/prism.css';

async function sendRequest(sendFunction, url, data) {
    return (await sendFunction(url, data, {headers: {'Content-Type': 'application/json'}})).status === 200;
}

async function sendAction(id, data) {
    return sendRequest(
        id == null ? axios.post : axios.put,
        id == null ? ACTION_URL : getActionURL(id),
        data
    );
}

async function deleteAction(id) {
    return (await axios.delete(getActionURL(id), {headers: {'Content-Type': 'application/json'}})).status === 200;
}

function ManageAction() {
    const [state, setState] = useState({});
    const pushToState = (obj) => {
        setState({...state, ...obj});
    }

    const params = useParams();
    const dispatch = useDispatch();
    useEffectOnce(() => {
        dispatch(getDevices());
        if (params.id) {
            axios.get(getActionURL(params.id)).then(res => {
                pushToState({
                    titleValue: res.data.title,
                    deviceValue: res.data.device_id,
                    scriptValue: res.data.cmd,
                    executeOnDiscoveryValue: res.data.execute_on_discovery
                });
            })
        }
    })

    const devices = useSelector((state) => state.devices);
    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography level="h2">Devices -> {params.id ? `Edit action ${state.titleValue}` : "New action"}</Typography>
                {params.id && (
                    <Button
                        variant="solid"
                        color="danger"
                        onClick={async () => {
                            if (!window.confirm("Are you sure you want to delete this action?")) {
                                return;
                            }
                            await deleteAction(params.id);
                            navigate('/devices');
                        }}
                    >
                        Delete
                    </Button>
                )}
            </Box>
            <Card sx={{ my: 3 }}>
                <CardContent>
                    <form onSubmit={async (e) => {
                        if (e.target.checkValidity()) {
                            e.preventDefault();
                            e.stopPropagation();
                            await sendAction(params.id, {
                                "title": state.titleValue,
                                "execute_on_discovery": state.executeOnDiscoveryValue,
                                "device_id": state.deviceValue,
                                "cmd": state.scriptValue
                            });
                            navigate(`/devices/${state.deviceValue}`)
                        }
                    }}>
                        <FormControl>
                            <Input required value={state.titleValue}
                                   onChange={e => pushToState({titleValue: e.target.value})} placeholder="Action title"
                                   sx={{mb: 1}} size={"lg"}/>
                        </FormControl>
                        <FormControl>
                            <Select value={state.deviceValue}
                                    onChange={(_, value) => pushToState({deviceValue: value})}
                                    placeholder="Select a target device" size="lg" sx={{mb: 1}} variant="outlined">
                                <Option key="" value=""><strong>[All devices]</strong></Option>
                                {
                                    devices ? devices.map(device => <Option key={device.id} value={device.id}
                                                                            label={device.name}>{device.name}</Option>) : <></>
                                }
                            </Select>
                        </FormControl>
                        <FormControl>
                            <RadioGroup>
                                <FormLabel>Execution schedule</FormLabel>
                                <List sx={{
                                    '--List-gap': '0.5rem',
                                    '--ListItem-paddingY': '1rem',
                                    '--ListItem-radius': '8px',
                                    '--ListItemDecorator-size': '32px',
                                }}>
                                    <ListItem variant="outlined" sx={{boxShadow: 'sm'}}>
                                        <ListItemDecorator><Troubleshoot/></ListItemDecorator>
                                        <Checkbox checked={!!state.executeOnDiscoveryValue} overlay
                                                  onChange={e => pushToState({executeOnDiscoveryValue: !state.executeOnDiscoveryValue})}
                                                  label={"On discovery"} slotProps={{
                                            action: ({checked}) => ({
                                                sx: (theme) => ({
                                                    ...(checked && {
                                                        inset: -1,
                                                        border: '2px solid',
                                                        borderColor: theme.vars.palette.primary[500],
                                                    }),
                                                }),
                                            }),
                                        }}
                                        />
                                    </ListItem>
                                </List>
                            </RadioGroup>
                        </FormControl>
                        <FormLabel>Action script</FormLabel>
                        <Alert sx={{ mb: 1 }}>
                            The following variables are available: <strong>%url, %ip, %prompt (input will be requested on execution)</strong>
                        </Alert>
                        <FormControl>
                            <Editor
                                value={state.scriptValue || '#!/bin/bash\n'}
                                onValueChange={code => pushToState({scriptValue: code})}
                                highlight={code => highlight(code, languages.bash, 'bash')}
                                padding={10}
                                style={{
                                    fontFamily: "monospace",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    minHeight: "150px",
                                    resize: "vertical",
                                    overflow: "auto"
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button type="submit">{params.id ? "Update" : "Create"}</Button>
                            </Box>
                        </FormControl>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ManageAction;
