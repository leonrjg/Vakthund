import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getAllDiscoveries, getDiscoveryDetail, updateDiscoveryTags, updateDiscoveryField} from "../../redux/actions/Actions";
import {Button, Card, Chip, ChipDelete, IconButton, Input, Option, Select, Table} from "@mui/joy";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/joy/FormLabel";
import {Add, CallToActionOutlined, Close, Delete} from "@mui/icons-material";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import {getActionExecuteURL, getDiscoveryURL} from "../../redux/types/Types";
import axios from "axios";
import Box from "@mui/material/Box";
import PingButton from "../PingButton";
import OutputCard from "../OutputCard";

async function deleteDiscovery(id) {
    return (await axios.delete(getDiscoveryURL(id), {headers: {'Content-Type': 'application/json'}})).status === 200;
}

function View() {
    const params = useParams();
    const dispatch = useDispatch();
    const [actionOutput, setActionOutput] = useState("");
    const [addingTag, setAddingTag] = useState(false);
    const [newTagValue, setNewTagValue] = useState("");
    const [editingIp, setEditingIp] = useState(false);
    const [ipValue, setIpValue] = useState("");
    const [editingUrl, setEditingUrl] = useState(false);
    const [urlValue, setUrlValue] = useState("");

    useEffect(() => {
        dispatch(getDiscoveryDetail(params.id));
    }, [params.id]);

    const executeAction = ((event, value) => {
        let action = selector.actions.find(action => action.id === value);
        let actionUrl = getActionExecuteURL(params.id, value);
        if (action.has_prompt) {
            const promptPosition = action.cmd.indexOf("%prompt");
            let prompt = window.prompt("Enter input for ... " + action.cmd.substring(promptPosition - 15, promptPosition + 15) + " ...");
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

    const handleAddTag = () => {
        if (!newTagValue.trim()) return;

        const currentTags = selector.details?.tags ? selector.details.tags.split(",").map(t => t.trim()).filter(t => t) : [];
        if (currentTags.includes(newTagValue.trim())) {
            setNewTagValue("");
            setAddingTag(false);
            return;
        }

        const updatedTags = [...currentTags, newTagValue.trim()].join(",");
        dispatch(updateDiscoveryTags(params.id, updatedTags));
        setNewTagValue("");
        setAddingTag(false);
    };

    const handleRemoveTag = (tagToRemove) => {
        console.log("Removing tag:", tagToRemove);
        const currentTags = selector.details?.tags ? selector.details.tags.split(",").map(t => t.trim()).filter(t => t) : [];
        console.log("Current tags:", currentTags);
        const updatedTags = currentTags.filter(tag => tag !== tagToRemove).join(",");
        console.log("Updated tags:", updatedTags);
        dispatch(updateDiscoveryTags(params.id, updatedTags));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTag();
        } else if (e.key === 'Escape') {
            setNewTagValue("");
            setAddingTag(false);
        }
    };

    const handleSaveIp = () => {
        if (ipValue.trim()) {
            dispatch(updateDiscoveryField(params.id, 'ip', ipValue.trim()));
        }
        setEditingIp(false);
    };

    const handleSaveUrl = () => {
        if (urlValue.trim()) {
            dispatch(updateDiscoveryField(params.id, 'url', urlValue.trim()));
        }
        setEditingUrl(false);
    };

    const handleIpKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveIp();
        } else if (e.key === 'Escape') {
            setEditingIp(false);
        }
    };

    const handleUrlKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveUrl();
        } else if (e.key === 'Escape') {
            setEditingUrl(false);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{ height: '500px', overflowY: 'clip' }}>
                <Card variant="soft" color="neutral" sx={{ height: '100%', overflow: 'auto' }}>
                    <FormLabel>IP</FormLabel>
                    {editingIp ? (
                        <Input
                            size="sm"
                            value={ipValue}
                            onChange={(e) => setIpValue(e.target.value)}
                            onKeyDown={handleIpKeyPress}
                            onBlur={handleSaveIp}
                            autoFocus
                            sx={{ mb: 1 }}
                        />
                    ) : (
                        <Box
                            onClick={() => {
                                setIpValue(selector.details?.ip || "");
                                setEditingIp(true);
                            }}
                            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }, p: 0.5, borderRadius: 1, mb: 1 }}
                        >
                            {selector.details?.ip || <em>Click to add IP</em>}
                        </Box>
                    )}
                    <FormLabel>URL <PingButton url={selector.details?.url} sx={{ height: '100%', verticalAlign: 'bottom', ml: 0.3, padding: 0.7 }}/></FormLabel>
                    {editingUrl ? (
                        <Input
                            size="sm"
                            value={urlValue}
                            onChange={(e) => setUrlValue(e.target.value)}
                            onKeyDown={handleUrlKeyPress}
                            onBlur={handleSaveUrl}
                            autoFocus
                            sx={{ mb: 1 }}
                        />
                    ) : (
                        <Box
                            onClick={() => {
                                setUrlValue(selector.details?.url || "");
                                setEditingUrl(true);
                            }}
                            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }, p: 0.5, borderRadius: 1, mb: 1 }}
                        >
                            {selector.details?.url || <em>Click to add URL</em>}
                        </Box>
                    )}
                    <FormLabel>Device</FormLabel> <Link to={`/?query=${selector.details?.Device?.name}`}>
                    <Chip color={"primary"}>{selector.details?.Device?.name}</Chip></Link>
                    <FormLabel>
                        Tags
                        <IconButton size="sm" onClick={() => setAddingTag(true)} sx={{ ml: 1 }}>
                            <Add />
                        </IconButton>
                    </FormLabel>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selector.details?.tags?.split(",").filter(tag => tag.trim()).map((tag, index) => (
                            <Chip
                                key={index}
                                variant="outlined"
                                endDecorator={
                                    <ChipDelete
                                        onDelete={() => handleRemoveTag(tag.trim())}
                                    />
                                }
                            >
                                <Link to={`/?query=${tag.trim()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {tag.trim()}
                                </Link>
                            </Chip>
                        ))}
                        {addingTag && (
                            <Input
                                size="sm"
                                placeholder="New tag"
                                value={newTagValue}
                                onChange={(e) => setNewTagValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={() => {
                                    if (!newTagValue.trim()) {
                                        setAddingTag(false);
                                    }
                                }}
                                autoFocus
                                sx={{ minWidth: '100px', maxWidth: '150px' }}
                            />
                        )}
                    </Box>
                    <FormLabel>Management</FormLabel>
                    <Box>
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
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
               <Select color="success" disabled={selector.actions?.length === 0}
                                startDecorator={<CallToActionOutlined/>} placeholder="Execute an action" size="lg"
                                sx={{ mb: 1 }} variant="outlined"
                                onChange={executeAction}>
                            {selector.actions?.map((action) => (
                                <Option value={action.id}>{action.title}</Option>
                            ))}
                </Select>
                <OutputCard output={actionOutput} />
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', height: '500px', overflowX: 'clip' }}>
                <Card variant="soft" color="neutral" sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'clip' }}>
                    <FormLabel>Full info</FormLabel>
                    <Box sx={{ overflow: 'auto', flex: 1 }}>
                        <Editor
                            value={JSON.stringify(JSON.parse(selector.details?.full_data || '{}'), null, 4)}
                            onValueChange={() => {}}
                            highlight={code => highlight(code, languages.json)}
                            padding={10}
                            style={{pointerEvents: "none", fontFamily: "monospace", fontSize: "small"}}
                        />
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'neutral.50', marginTop: '3px' }}>
                    <Table sx={{ textAlign: 'center' }} borderAxis="both" hoverRow>
                        <thead>
                        <tr>
                            <th colSpan={4} style={{fontWeight: 100, lineHeight: '10px', textAlign: 'center'}}>EXECUTION LOGS</th>
                        </tr>
                        <tr>
                            <th style={{textAlign: 'center'}}>Date</th>
                            <th style={{textAlign: 'center'}}>Action</th>
                            <th style={{textAlign: 'center'}}>Result</th>
                            <th style={{textAlign: 'center'}}>Log</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selector.executions?.map((execution) => (
                            <tr>
                                <td>{execution.execution_date}</td>
                                <td>{execution.Action?.title ?? "[Deleted action]"}</td>
                                <td>{execution.success ? <Chip color="success">SUCCESS</Chip> :
                                    <Chip color="danger">FAILED</Chip>}</td>
                                <td><Button color={"neutral"} disabled={!execution.result} onClick={() => window.open(window.URL.createObjectURL(new Blob([execution.result], { type: "text/html;charset=utf8" })))}> View log</Button></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
            </Grid>
        </Grid>
    );
}

export default View;
