import React, {useState} from "react";
import FormControl from '@mui/joy/FormControl';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import {Alert, Button, Input, List, ListItem, ListItemDecorator, Option, Select, Textarea} from "@mui/joy";
import {Mouse, Troubleshoot} from "@mui/icons-material";
import FormLabel from "@mui/joy/FormLabel";
import Sheet from "@mui/joy/Sheet";
import {useSelector} from "react-redux";
import axios from "axios";
import {ACTION_URL, DEVICE_URL, getActionURL} from "../../redux/types/Types";
import {useNavigate} from "react-router-dom";

async function postAction(data) {
    return (await axios.post(ACTION_URL, data, {headers: {'Content-Type': 'application/json'}})).status === 200;
}

function NewAction() {
    const [state, setState] = useState({});
    const pushToState = (obj) => {
        setState({ ...state, ...obj });
    }
    const devices = useSelector((state) => state.devices);
    const navigate = useNavigate();
    return (
        <div>
            <h2 className={"d-inline"}>Devices -> New action</h2>
            <div className={"card shadow my-3"}>
                <div className={"card-body"}>
                    <FormControl>
                        <Input value={state.titleValue} onChange={ e => pushToState({titleValue: e.target.value}) } placeholder="Action title" sx={{mb: 1}} size={"lg"}/>
                    </FormControl>
                    <FormControl>
                        <Select onChange={ (_, value) => pushToState({deviceValue: value}) } placeholder="Select a target device" size="lg" sx={{mb: 1}} variant="outlined">
                            {
                                devices ? devices.map(device => <Option key={device.id} value={device.id}>{device.name}</Option>) : <></>
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <RadioGroup defaultValue="On demand">
                            <FormLabel>Execution frequency</FormLabel>
                            <List sx={{
                                minWidth: 240,
                                '--List-gap': '0.5rem',
                                '--ListItem-paddingY': '1rem',
                                '--ListItem-radius': '8px',
                                '--ListItemDecorator-size': '32px',
                            }}>
                                {['On discovery', 'On demand'].map((item, index) => (
                                    <ListItem variant="outlined" key={item} sx={{boxShadow: 'sm'}}>
                                        <ListItemDecorator>{[<Troubleshoot/>, <Mouse/>][index]}</ListItemDecorator>
                                        <Radio overlay onChange={ e => pushToState({frequency: e.target.value}) } value={item} label={item} slotProps={{
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
                                ))}
                            </List>
                        </RadioGroup>
                    </FormControl>
                    <FormLabel>Action script</FormLabel>
                    <Alert className={"mb-1"}>
                        The following variables are available: <strong>%url, %ip</strong>
                    </Alert>
                    <FormControl>
                        <Textarea minRows={5} value={state.scriptValue} onChange={ e => pushToState({scriptValue: e.target.value}) } placeholder="Enter a shell command" size="lg" variant="soft"/>
                    </FormControl>
                    <FormControl>
                        <Button className={"float-end mt-3"} onClick={async () => {
                            alert(JSON.stringify({"title": state.titleValue, "frequency": state.frequency, "device": state.deviceValue, "script": state.scriptValue}));
                            await postAction({"title": state.titleValue, "frequency": state.frequency, "device_id": state.deviceValue, "cmd": state.scriptValue});
                            navigate('/devices')
                        }}>Create</Button>
                    </FormControl>
                </div>
            </div>
        </div>
    );
}

export default NewAction;
