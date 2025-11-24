import axios from "axios";
import {
    ALL_DISCOVERIES,
    DEVICE_ALL,
    DEVICE_ALL_URL,
    DISCOVERY_ALL_URL,
    DISCOVERY_DETAIL,
    DISCOVERY_DETAIL_URL,
    SETTINGS,
    SETTINGS_URL,
    SYSTEM_LOGS,
    SYSTEM_LOGS_URL,
    ACTION_LOGS,
    ACTION_LOGS_URL,
    SCAN_STATUS,
    SCAN_STATUS_URL,
} from "../types/Types";

export const getAllDiscoveries = () => {
    return async (dispatch) => {
        let res = [];
        res = await axios.get(DISCOVERY_ALL_URL);
        dispatch({
            type: ALL_DISCOVERIES,
            discoveries: res.data,
        });
    };
};

export const getDiscoveryDetail = (id) => {
    return async (dispatch) => {
        const res = await axios.get(DISCOVERY_DETAIL_URL(id));
        dispatch({type: DISCOVERY_DETAIL, discovery: res.data});
    };
};

export const getDevices = () => {
    return async (dispatch) => {
        const res = await axios.get(DEVICE_ALL_URL);
        dispatch({type: DEVICE_ALL, devices: res.data});
    };
};

export const getSettings = () => {
    return async (dispatch) => {
        const res = await axios.get(SETTINGS_URL);
        dispatch({type: SETTINGS, settings: res.data});
    };
};

export const getSystemLogs = () => {
    return async (dispatch) => {
        const res = await axios.get(SYSTEM_LOGS_URL);
        dispatch({type: SYSTEM_LOGS, systemLogs: res.data});
    };
};

export const getActionLogs = () => {
    return async (dispatch) => {
        const res = await axios.get(ACTION_LOGS_URL);
        dispatch({type: ACTION_LOGS, actionLogs: res.data});
    };
};

export const getScanStatus = () => {
    return async (dispatch) => {
        const res = await axios.get(SCAN_STATUS_URL);
        dispatch({type: SCAN_STATUS, scanStatus: res.data});
    };
};
