import React from "react";
import {CloseButton} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDevices} from "../../redux/actions/Actions";
import {Alert, Badge, Button, Card, CardActions, CardContent, IconButton, Option, Skeleton} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useEffectOnce} from "react-use";
import axios from "axios";
import {DEVICE_URL, getDeviceURL} from "../../redux/types/Types";


async function deleteDevice(id) {
    return (await axios.delete(getDeviceURL(id), {headers: {'Content-Type': 'application/json'}})).status === 200;
}
function GetDeviceCard(dispatch, id, name, discoveryCount, queryCount) {
    return (
        <Card variant="soft" className={"me-1"} sx={{
            width: '260px',
            overflow: 'auto',
            display: 'inline-block'
        }}>
            <CardContent orientation="horizontal">
                <CardContent>
                    <CloseButton onClick={async () => {
                        if (!window.confirm("Are you sure you want to delete this device?")) {
                            return;
                        }
                        await deleteDevice(id);
                        dispatch(getDevices());
                    }} className={"float-end"}/>
                    <Link to={`/devices/` + id}><Typography level="h2"
                                                        style={{textAlign: "center"}}>{name}</Typography></Link>
                </CardContent>
            </CardContent>
            <CardActions buttonFlex="0 1 120px" style={{justifyContent: "center"}}>
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
    });

    const data = useSelector((state) => state.devices);

    return (
        <div>
            <h2 className={"d-inline"}>Devices</h2>
            <Link as={Link} to="/devices/actions/new"><Button className="d-inline float-end mx-1" variant="solid"
                                                              color={"warning"} disabled={!data?.length}>+ Add action</Button></Link>
            <Link as={Link} to="/devices/new"><Button className="d-inline float-end" variant="solid">+ Add
                device</Button></Link>
            <div className={"card shadow my-3"}>
                <div className={"card-body"}>
                    {data?.length === 0 ? <Alert color="warning" className={"mb-2"}>No devices yet.</Alert> : ""}

                    {data?.length > 0 ? data.map(i => GetDeviceCard(dispatch, i.id, i.name, i.discoveries, i.queries))
                        : Array(3).fill().map(() => <Skeleton animation="wave" level={"body-lg"} className={"me-1 d-inline-block"} variant={"rectangular"} height={"160px"} width={"260px"}/>)}
                </div>
            </div>
        </div>
    );
}

export default Devices;
