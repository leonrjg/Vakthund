import React, {useState} from "react";
import FormControl from '@mui/joy/FormControl';
import {Button, Input, Option, Select} from "@mui/joy";
import axios from "axios";
import {DEVICE_URL, DISCOVERY_URL, getDeviceURL, getDiscoveryURL} from "../../redux/types/Types";
import {useNavigate, useParams} from "react-router-dom";
import {useEffectOnce} from "react-use";
import {getDevices, getDiscoveryDetail} from "../../redux/actions/Actions";
import {useDispatch, useSelector} from "react-redux";


async function sendRequest(sendFunction, url, data) {
    return (await sendFunction(url, data, {headers: {'Content-Type': 'application/json'}})).status === 200;
}

async function sendDiscovery(id, data) {
    return sendRequest(
        id == null ? axios.post : axios.put,
        id == null ? DISCOVERY_URL : getDiscoveryURL(id),
        data
    );
}

function ManageDiscovery() {
    const params = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState({});
    const pushToState = (obj) => {
        setState({...state, ...obj});
    }

    const dispatch = useDispatch();
    useEffectOnce(() => {
        dispatch(getDevices());
        if (params.id) {
            axios.get(getDiscoveryDetail(params.id)).then(res => {
                pushToState({
                    hostValue: res.data.url ? res.data.url : res.data.ip,
                    deviceValue: res.data.device_id,
                    commentValue: res.data.comment,
                    tagsValue: res.data.tags
                });
            })
        }
    })

    const devices = useSelector((state) => state.devices);

    return (
        <div>
            <h2 className={"d-inline"}>Discoveries -> {params.id ? `Edit discovery ${state.nameValue}` : "New manual discovery"}</h2>
            <div className={"card shadow my-3"}>
                <div className={"card-body"}>
                    <form onSubmit={async (e) => {
                        if (e.target.checkValidity()) {
                            e.preventDefault();
                            e.stopPropagation();
                            await sendDiscovery(params.id, {
                                "ip": state.hostValue.includes("://") ? state.hostValue.split("://")[1] : state.hostValue,
                                "url": state.hostValue.includes("://") ? state.hostValue : "http://" + state.hostValue,
                                "device_id": state.deviceValue,
                                "comment": state.commentValue,
                                "tags": state.tagsValue,
                                "source": "manual"
                            });
                            navigate('/');
                        }
                    }}>
                        <FormControl>
                            <Select required value={state.deviceValue}
                                    onChange={(_, value) => pushToState({deviceValue: value})}
                                    placeholder="Select a target device" size="lg" sx={{mb: 1}} variant="outlined">
                                {
                                    devices ? devices.map(device => <Option key={device.id} value={device.id}
                                                                            label={device.name}>{device.name}</Option>) : <></>
                                }
                            </Select>
                        </FormControl>
                        <br />
                        <FormControl>
                            <Input required value={state.hostValue}
                                   onChange={e => pushToState({hostValue: e.target.value})} placeholder="Hostname or URL"
                                   sx={{mb: 2}}/>
                        </FormControl>
                        <FormControl>
                                <Input required value={state.tagsValue}
                                       onChange={e => pushToState({tagsValue: e.target.value})} placeholder="Tags (CSV)"
                                       sx={{mb: 2}}/>
                        </FormControl>
                        <FormControl>
                            <Input value={state.commentValue}
                                   onChange={e => pushToState({commentValue: e.target.value})} placeholder="Comment"
                                   sx={{mb: 2}}/>
                        </FormControl>
                        <FormControl>
                            <Button type="submit"
                                    className={"float-end mt-3"}>{params.id ? "Update" : "Create"}</Button>
                        </FormControl>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ManageDiscovery;
