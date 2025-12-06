import React, {useEffect, useState} from "react";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Sheet from '@mui/joy/Sheet';
import {Button, Card, CardContent, Divider, Input, List, ListItem, ListItemButton, ListItemDecorator, Switch, Typography} from "@mui/joy";
import axios from "axios";
import {DEVICE_URL, getDeviceURL} from "../../redux/types/Types";
import {Link, useNavigate, useParams} from "react-router-dom";
import {GetSearchEngineRadio} from "./utils/SearchEngineRadio";
import {useEffectOnce} from "react-use";
import {getSettings} from "../../redux/actions/Actions";
import {Close} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";


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

    const settings = useSelector((state) => { return state.settings });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSettings());
    }, []);

    const [state, setState] = useState({});
    const [queries, setQueries] = useState([]);

    const pushToState = (obj) => {
        setState({...state, ...obj});
    }
    const addQuery = (obj) => {
        setQueries((prevAll) => [...prevAll, obj]);
    }
    const updateQuery = (index, obj) => {
        setQueries((prevArr) => {
            const result = [...prevArr];
            result[index] = obj
            return result;
        });
    }

    useEffectOnce(() => {
        if (params.id) {
            axios.get(getDeviceURL(params.id)).then(res => {
                pushToState({
                    nameValue: res.data.name,
                    actionsValue: res.data.actions
                });
                setQueries(res.data.queries);
            })
        }
    })

    return (
        <Box>
            <Typography level="h2">Devices -> {params.id ? `Edit device ${state.nameValue}` : "New device"}</Typography>
            <Card sx={{ my: 3, boxShadow: 1 }}>
                <CardContent>
                    <form onSubmit={async (e) => {
                        if (e.target.checkValidity()) {
                            e.preventDefault();
                            e.stopPropagation();
                            await sendDevice(params.id, {
                                "name": state.nameValue,
                                "queries": queries.filter(q => q != null),
                            });
                            navigate('/devices');
                        }
                    }}>
                        <FormControl>
                            <Input required value={state.nameValue}
                                   onChange={e => pushToState({nameValue: e.target.value})} placeholder="Device name"
                                   sx={{mb: 2}}/>
                        </FormControl>
                        <Divider/>
                            {
                                queries.map((query, i) => {
                                    if (!query) {
                                        return null;
                                    }
                                    return <FormControl>
                                            <Sheet variant="soft" sx={{p: 2, mb: 1}}>
                                            <Close onClick={async () => { updateQuery(i, null) }} sx={{ float: 'right', ml: 5, mb: 5 }}/>
                                            <FormLabel>Query</FormLabel>
                                            <Input required value={queries[i]?.query}
                                                   onChange={e => {query.query = e.target.value; updateQuery(i, query)}} placeholder="Query"
                                                   sx={{mb: 2}}/>
                                            <FormLabel>Enabled</FormLabel>
                                            <Switch checked={query.enabled} onChange={() => {query.enabled = !query.enabled; updateQuery(i, query)}} inputProps={{ 'aria-label': 'controlled' }} />
                                            {GetSearchEngineRadio(e => {query.engine = e.target.value; updateQuery(i, query)}, query.engine, settings)}
                                            </Sheet>
                                        </FormControl>
                                })
                            }
                        <FormControl>
                            <Button color={"neutral"} variant={"outlined"} onClick={() => addQuery({})}>+ Add query</Button>
                        </FormControl>

                        {params.id ?
                            <FormControl>
                                <Sheet variant="soft" sx={{p: 2, mt: 2}}>
                                    <FormLabel>Actions ({state.actionsValue?.length || 0})</FormLabel>
                                    <List aria-labelledby="decorated-list-demo">
                                        {state.actionsValue?.map((action, index) => (
                                            <Link to={"/devices/actions/" + action.id} style={{textDecoration: "none"}}>
                                                <ListItem sx={{ mb: 1 }}>
                                                    <ListItemButton variant={"outlined"}>
                                                        <ListItemDecorator>⌘</ListItemDecorator> {action.title}
                                                    </ListItemButton>
                                                </ListItem>
                                            </Link>
                                        ))}
                                    </List>
                                </Sheet>
                            </FormControl>
                            : <></>}
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

export default ManageDevice;
