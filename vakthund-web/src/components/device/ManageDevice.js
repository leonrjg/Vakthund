import React, {useEffect, useState} from "react";
import Avatar from '@mui/joy/Avatar';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import {Button, Divider, Input, List, ListItem, ListItemButton, ListItemDecorator} from "@mui/joy";
import axios from "axios";
import {DEVICE_URL, getDeviceURL, SETTINGS_URL} from "../../redux/types/Types";
import {Link, useNavigate, useParams} from "react-router-dom";
import {GetSearchEngineRadio} from "./utils/SearchEngineRadio";
import {useEffectOnce} from "react-use";


async function sendRequest(sendFunction, url, data) {
    return (await sendFunction(url, data, {headers: {'Content-Type': 'application/json'}})).status === 200;
}

async function sendDevice(id, data) {
    return sendRequest(
        id == null ? axios.post : axios.put,
        id == null ? DEVICE_URL : getDeviceURL(id),
        data
    );
}

function ManageDevice() {
    const params = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState({});
    const pushToState = (obj) => {
        setState({ ...state, ...obj });
    }

    useEffectOnce(() => {
        if (params.id) {
            axios.get(getDeviceURL(params.id)).then(res => {
                pushToState({nameValue: res.data.name, queryValue: res.data.queries[0]?.query, engineValue: res.data.queries[0]?.engine, actionsValue: res.data.actions});
            })
        }
    })

    return (
        <div>
            <h2 className={"d-inline"}>Devices -> {params.id ? `Edit device ${state.nameValue}` : "New device"}</h2>
            <div className={"card shadow my-3"}>
                <div className={"card-body"}>
                    <FormControl>
                        <Input value={state.nameValue} onChange={ e => pushToState({nameValue: e.target.value}) } placeholder="Device name" sx={{mb: 2}}/>
                    </FormControl>
                    <Divider/>
                    <FormControl>
                        <Sheet variant="soft" sx={{p: 2}}>
                            <FormLabel>Query</FormLabel>
                            <Input value={state.queryValue} onChange={ e => pushToState({queryValue: e.target.value}) } placeholder="Query" sx={{mb: 2}}/>
                            {GetSearchEngineRadio(e => pushToState({engineValue: e.target.value}), state.engineValue)}
                        </Sheet>
                    </FormControl>
                    {params.id ?
                        <FormControl>
                            <Sheet variant="soft" sx={{p: 2, mt: 2}}>
                                <FormLabel>Actions ({state.actionsValue?.length || 0})</FormLabel>
                                <List aria-labelledby="decorated-list-demo">
                                    {state.actionsValue?.map((action, index) => (
                                        <Link to={"/devices/actions/" + action.id} style={{textDecoration: "none"}}>
                                            <ListItem>
                                                    <ListItemButton variant={"outlined"}>
                                                            <ListItemDecorator>⌘</ListItemDecorator> {action.title}
                                                    </ListItemButton>
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                            </Sheet>
                        </FormControl>
                    : <></> }
                    <FormControl>
                        <Button className={"float-end mt-3"} onClick={async () => {
                            await sendDevice(params.id, {"name": state.nameValue, "query": state.queryValue, "engine": state.engineValue});
                            navigate('/devices')
                        }}>{params.id ? "Update" : "Create"}</Button>
                    </FormControl>
                </div>
            </div>
        </div>
    );
}

export default ManageDevice;
