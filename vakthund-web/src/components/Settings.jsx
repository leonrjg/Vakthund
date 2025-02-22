import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSettings} from "../redux/actions/Actions";
import {Alert, Button, Textarea} from "@mui/joy";
import {SETTINGS_URL} from "../redux/types/Types";
import axios from "axios";

async function postSettings(data) {
    return (await axios.post(SETTINGS_URL, data, {headers: {'Content-Type': 'application/json'}})).status === 200;
}

function Settings() {
    const data = useSelector((state) => {
        return state.settings;
    });
    const [settingsJson, setSettingsJson] = useState(JSON.stringify(data, null, 2));
    let [isSubmitted, setSubmitted] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSettings());
    }, []);

    useEffect(() => {
        setSettingsJson(JSON.stringify(data, null, 2));
    }, [data])

    return (
        <div>
            <h2 className={"d-inline"}>Settings</h2>
            <div className={"card shadow my-3"}>
                <div className={"card-body"}>
                    {isSubmitted ?
                        <Alert color="success" variant="soft" className={"mb-1"}>Saved settings</Alert> : <></>}
                    <Textarea minRows={5} value={settingsJson} onChange={e => setSettingsJson(e.target.value)}
                              size="lg"/>
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
