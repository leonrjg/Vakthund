import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getSettings} from "../redux/actions/Actions";
import {Alert, Button, Card, CardContent, Typography} from "@mui/joy";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import {SETTINGS_URL} from "../redux/types/Types";
import axios from "axios";
import {PlayArrow} from "@mui/icons-material";
import Box from "@mui/material/Box";

async function postSettings(data) {
    return (await axios.post(SETTINGS_URL, data, {headers: {'Content-Type': 'application/json'}})).status === 200;
}

function Settings() {
    const data = useSelector((state) => {
        return state.settings;
    });
    const [settingsJson, setSettingsJson] = useState(JSON.stringify(data || {}, null, 2));
    let [isSubmitted, setSubmitted] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSettings());
    }, []);

    useEffect(() => {
        setSettingsJson(JSON.stringify(data || {}, null, 2));
    }, [data])

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography level="h2">Settings</Typography>
                <Button
                    color="success"
                    startDecorator={<PlayArrow />}
                    onClick={() => navigate("/logs?scan=true")}
                >
                    Run Scan
                </Button>
            </Box>
            <Card sx={{ my: 3, boxShadow: 1 }}>
                <CardContent>
                    {isSubmitted &&
                        <Alert color="success" variant="soft" sx={{ mb: 1 }}>Saved settings</Alert>}
                    <Editor
                        value={settingsJson}
                        onValueChange={setSettingsJson}
                        highlight={code => highlight(code, languages.json)}
                        padding={10}
                        style={{fontFamily: "monospace", border: "1px solid #ccc", borderRadius: "4px", minHeight: "200px"}}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={async () => {
                            setSubmitted(await postSettings(settingsJson))
                            dispatch(getSettings());
                        }}>Update</Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Settings;
