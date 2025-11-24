import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getSettings} from "../redux/actions/Actions";
import {Alert, Button} from "@mui/joy";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import {SETTINGS_URL} from "../redux/types/Types";
import axios from "axios";
import {PlayArrow} from "@mui/icons-material";

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
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className={"d-inline"}>Settings</h2>
                <Button
                    color="success"
                    startDecorator={<PlayArrow />}
                    onClick={() => navigate("/logs?scan=true")}
                >
                    Run Scan
                </Button>
            </div>
            <div className={"card shadow my-3"}>
                <div className={"card-body"}>
                    {isSubmitted ?
                        <Alert color="success" variant="soft" className={"mb-1"}>Saved settings</Alert> : <></>}
                    <Editor
                        value={settingsJson}
                        onValueChange={setSettingsJson}
                        highlight={code => highlight(code, languages.json)}
                        padding={10}
                        style={{fontFamily: "monospace", border: "1px solid #ccc", borderRadius: "4px", minHeight: "200px"}}
                    />
                    <Button className={"float-end mt-3"} onClick={async () => {
                        setSubmitted(await postSettings(settingsJson))
                        dispatch(getSettings());
                    }}>Update</Button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
