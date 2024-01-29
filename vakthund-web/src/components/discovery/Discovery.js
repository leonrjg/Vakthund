import React, {useEffect, useState} from "react";
import {Badge, Col, Row, Table} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDiscoveryDetail} from "../../redux/actions/Actions";
import {Card, Chip, Option, Select} from "@mui/joy";
import FormLabel from "@mui/joy/FormLabel";
import {CallToActionOutlined} from "@mui/icons-material";
import {TextareaAutosize} from "@mui/material";
import {getActionExecuteURL} from "../../redux/types/Types";

function Discovery() {
    const params = useParams();
    const dispatch = useDispatch();
    const [actionOutput, setActionOutput] = useState("");

    useEffect(() => {
        dispatch(getDiscoveryDetail(params.id));
    }, [params.id]);

    const executeAction = ((event, value) => {
        const sse = new EventSource(getActionExecuteURL(params.id, value));
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

    return (
        <Row className="m-3 justify-content-center">
            <Col sm={3} className={"mb-1"} style={{height: "500px"}}>
                <Card className={"h-100 bg-light shadow"}>
                    <FormLabel>IP</FormLabel> {selector.details?.ip}<br/>
                    <FormLabel>URL</FormLabel> {selector.details?.url}<br/>
                    <FormLabel>Device</FormLabel> <Link to={`/?query=${selector.details?.Device?.name}`}><Badge
                    bg="primary">{selector.details?.Device?.name}</Badge></Link>
                    <FormLabel>Tags</FormLabel> {selector.details?.tags?.split(",").map(tag => <Link
                    to={`/?query=${tag}`}><Badge
                    bg="secondary">{tag}</Badge></Link>)}<br/>
                </Card>
            </Col>
            <Col sm={6} className={"d-flex flex-column"} style={{height: "500px"}}>
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
            </Col>
            <Col sm={3} className={"mb-1"} style={{height: "500px"}}>
                <Card className={"bg-light shadow"} style={{height: "500px"}}>
                    <FormLabel>Full info</FormLabel>
                    <TextareaAutosize style={{overflow: "auto"}}
                                      value={JSON.stringify(JSON.parse(selector.details?.full_data || '{}'), null, 4)}></TextareaAutosize>
                </Card>
            </Col>
            <Row className="m-3 justify-content-center">
                <Col sm={12} className={"d-flex flex-column bg-light mt-3"}>
                    <Table className={"text-center mt-3"} bordered hover>
                        <thead>
                        <tr>
                            <th colSpan={4} style={{fontWeight: "100", lineHeight: "10px"}}>EXECUTION LOGS</th>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <th>Action</th>
                            <th>Result</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selector.executions?.map((execution) => (
                            <tr>
                                <td>{execution.execution_date}</td>
                                <td>{execution.Action?.title}</td>
                                <td>{execution.success ? <Chip color="success">SUCCESS</Chip> :
                                    <Chip color="danger">FAILED</Chip>}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Row>
    );
}

export default Discovery;
