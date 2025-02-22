import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getAllDiscoveries, getDiscoveryDetail} from "../../redux/actions/Actions";
import {Button, Card, Chip, Grid, Option, Select, Table} from "@mui/joy";
import FormLabel from "@mui/joy/FormLabel";
import {CallToActionOutlined, Delete} from "@mui/icons-material";
import {TextareaAutosize} from "@mui/material";
import {getActionExecuteURL, getDiscoveryURL} from "../../redux/types/Types";
import axios from "axios";
import Box from "@mui/material/Box";
import PingButton from "../PingButton";

async function deleteDiscovery(id) {
    return (await axios.delete(getDiscoveryURL(id), {headers: {'Content-Type': 'application/json'}})).status === 200;
}

function View() {
    const params = useParams();
    const dispatch = useDispatch();
    const [actionOutput, setActionOutput] = useState("");

    useEffect(() => {
        dispatch(getDiscoveryDetail(params.id));
    }, [params.id]);

    const executeAction = ((event, value) => {
        let action = selector.actions.find(action => action.id === value);
        let actionUrl = getActionExecuteURL(params.id, value);
        if (action.has_prompt) {
            const promptPosition = action.cmd.indexOf("%prompt");
            let prompt = window.prompt("Enter input for ... " + action.cmd.substring(promptPosition - 10, promptPosition + 10) + " ...");
            if (!prompt) {
                return;
            }
            actionUrl += "?prompt=" + prompt;
        }
        const sse = new EventSource(actionUrl);
        let output = "";

        sse.onmessage = e => {
            output += JSON.parse(e.data) + "\n";
            setActionOutput(output);
        };
        sse.onerror = () => {
            sse.close();
            dispatch(getDiscoveryDetail(params.id));
        }

        return () => {
            sse.close();
        };
    });

    const selector = (useSelector((state) => state.discovery) || {});
    const navigate = useNavigate();

    return (
        <Grid container spacing={2} className="m-3 justify-content-center">
            <Grid item sm={3} className={"mb-1"} style={{height: "500px"}}>
                <Card className={"h-100 bg-light"} style={{overflow: "auto"}}>
                    <FormLabel>IP</FormLabel> {selector.details?.ip}<br/>
                    <FormLabel>URL</FormLabel> {selector.details?.url}<br/>
                    <FormLabel>Device</FormLabel> <Link to={`/?query=${selector.details?.Device?.name}`}>
                    <Chip color={"primary"}>{selector.details?.Device?.name}</Chip></Link>
                    <FormLabel>Tags</FormLabel> <Box>{selector.details?.tags?.split(",").map(tag => <Link to={`/?query=${tag}`}><Chip variant={"outlined"}>{tag}</Chip></Link>)}</Box>
                    <FormLabel>Management</FormLabel>
                    <Box>
                        <PingButton url={selector.details?.url} style={{"height": "100%", "vertical-align": "bottom"}}/>
                        <Button color={"danger"} startDecorator={<Delete/>} onClick={async () => {
                            if (!window.confirm("Are you sure you want to delete this discovery?")) {
                                return;
                            }
                            await deleteDiscovery(params.id);
                            dispatch(getAllDiscoveries());
                            navigate(-1);
                        }}>Delete</Button>
                    </Box>
                </Card>
            </Grid>
            <Grid item sm={6} className={"d-flex flex-column"} style={{height: "500px"}}>
               <Select color="success" disabled={selector.actions?.length === 0}
                                startDecorator={<CallToActionOutlined/>} placeholder="Execute an action" size="lg"
                                className={"mb-1"} variant="outlined"
                                onChange={executeAction}>
                            {selector.actions?.map((action) => (
                                <Option value={action.id}>{action.title}</Option>
                            ))}
                </Select>
                <Card className={"h-100 bg-dark text-white-50 overflow-auto display-flex flex-column-reverse"}>
                    <p style={{whiteSpace: "pre-line"}}>{actionOutput}</p>
                </Card>
            </Grid>
            <Grid item sm={3} className={"mb-1"} style={{height: "500px"}}>
                <Card className={"bg-light"} style={{height: "500px"}}>
                    <FormLabel>Full info</FormLabel>
                    <TextareaAutosize style={{overflow: "auto"}}
                                      value={JSON.stringify(JSON.parse(selector.details?.full_data || '{}'), null, 4)}></TextareaAutosize>
                </Card>
            </Grid>
            <Grid container className="m-3 justify-content-center">
                <Grid item sm={12} className={"d-flex flex-column bg-light mt-3"}>
                    <Table className={"text-center mt-3"} bordered hover>
                        <thead>
                        <tr>
                            <th colSpan={4} style={{fontWeight: "100", lineHeight: "10px", textAlign: "center"}}>EXECUTION LOGS</th>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <th>Action</th>
                            <th>Result</th>
                            <th>Log</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selector.executions?.map((execution) => (
                            <tr>
                                <td>{execution.execution_date}</td>
                                <td>{execution.Action?.title}</td>
                                <td>{execution.success ? <Chip color="success">SUCCESS</Chip> :
                                    <Chip color="danger">FAILED</Chip>}</td>
                                <td><Button color={"neutral"} disabled={!execution.result} onClick={() => window.open(window.URL.createObjectURL(new Blob([execution.result], { type: "text/html;charset=utf8" })))}> View log</Button></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default View;
