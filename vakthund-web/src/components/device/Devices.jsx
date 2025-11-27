import * as React from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDevices, getActions} from "../../redux/actions/Actions";
import {Alert, Badge, Button, Card, CardActions, CardContent, Chip, IconButton, List, ListItem, ListItemButton, ListItemDecorator, Skeleton} from "@mui/joy";
import Grid from "@mui/material/Grid";
import Typography from "@mui/joy/Typography";
import {useEffectOnce} from "react-use";
import axios from "axios";
import {getDeviceURL} from "../../redux/types/Types";
import {Close} from "@mui/icons-material";
import Box from "@mui/material/Box";


async function deleteDevice(id) {
    return (await axios.delete(getDeviceURL(id), {headers: {'Content-Type': 'application/json'}})).status === 200;
}

function GetDeviceCard(dispatch, id, name, discoveryCount) {
    return (
        <Card variant="soft" sx={{
            width: '260px',
            maxWidth: '100%',
            overflow: 'auto',
            display: 'inline-block',
            mr: 1
        }}>
            <CardContent orientation="horizontal">
                <CardContent>
                    <Close onClick={async () => {
                        if (!window.confirm("Are you sure you want to delete this device?")) {
                            return;
                        }
                        await deleteDevice(id);
                        dispatch(getDevices());
                    }} sx={{ float: 'right' }}/>
                    <Link to={`/devices/` + id}><Typography level="h3"
                                                            sx={{ textAlign: 'center' }}>{name}</Typography></Link>
                </CardContent>
            </CardContent>
            <CardActions buttonFlex="0 1 120px" sx={{ justifyContent: 'center' }}>
                <IconButton color="neutral">
                    <Link to={`/?query=` + name}>
                        <Badge badgeContent={discoveryCount} badgeOrigin={{horizontal: "left"}}>
                            <Button variant="soft" size={"sm"}>Discoveries</Button>
                        </Badge>
                    </Link>
                </IconButton>
            </CardActions>
        </Card>
    );
}

function Devices() {
    const dispatch = useDispatch();

    useEffectOnce(() => {
        dispatch(getDevices());
        dispatch(getActions());
    });

    const data = useSelector((state) => state.devices);
    const actions = useSelector((state) => state.actions);

    return (
        <Box>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item md={9}>
                    <Typography level="h2">Devices</Typography>
                </Grid>
                <Grid item md={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to="/devices/new"><Button variant="solid">+ Add device</Button></Link>
                    </Box>
                </Grid>
            </Grid>

                    {data?.length === 0 ? <Alert color="warning" sx={{ mb: 2 }}>No devices yet.</Alert> : ""}

                    {data?.length > 0 ? data.map(i => GetDeviceCard(dispatch, i.id, i.name, i.discoveries))
                        : Array(3).fill().map(() => <Skeleton animation="wave" level={"body-lg"}
                                                              sx={{ mr: 1, display: 'inline-block' }} variant={"rectangular"}
                                                              height={"160px"} width={"260px"}/>)}


            <Box sx={{ mb: 4 }} />

            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item md={9}>
                    <Typography level="h3">Actions</Typography>
                </Grid>
                <Grid item md={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to="/devices/actions/new">
                            <Button variant="solid" color={"warning"} disabled={!data?.length}>
                                + Add action
                            </Button>
                        </Link>
                    </Box>
                </Grid>
            </Grid>

                    {!actions?.length ? <><Box sx={{ mb: 2 }} /><Alert color="warning" sx={{ mb: 2 }}>No actions yet.</Alert></> : ""}

                    {actions?.length > 0 ? (
                        <List aria-labelledby="decorated-list-demo">
                            {actions.map((action, index) => (
                                <Link key={action.id} to={"/devices/actions/" + action.id} style={{textDecoration: "none"}}>
                                    <ListItem sx={{ mb: 1 }}>
                                        <ListItemButton variant={"outlined"}>
                                            <ListItemDecorator>⌘</ListItemDecorator>
                                            {action.title}
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={action.Device ? "primary" : "neutral"}
                                                sx={{ ml: 1 }}
                                            >
                                                {action.Device ? action.Device.name : "Global"}
                                            </Chip>
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                    ) : (
                        Array(3).fill().map((_, idx) => <Skeleton key={idx} animation="wave" level={"body-lg"}
                                                              sx={{ mr: 1, display: 'inline-block' }} variant={"rectangular"}
                                                              height={"40px"} width={"100%"}/>)
                    )}

        </Box>
    );
}

export default Devices;
