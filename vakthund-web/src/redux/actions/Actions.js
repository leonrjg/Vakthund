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
