import {ALL_DISCOVERIES, DEVICE_ALL, DISCOVERY_DETAIL, SETTINGS, SYSTEM_LOGS, ACTION_LOGS, SCAN_STATUS} from "../types/Types";

const initialValue = {};

export const devicesReducer = (state = initialValue, action) => {
    switch (action.type) {
        case ALL_DISCOVERIES:
            return {
                ...state,
                discoveries: action.discoveries,
            };
        case DISCOVERY_DETAIL:
            return {
                ...state,
                discovery: action.discovery,
            };
        case DEVICE_ALL:
            return {
                ...state,
                devices: action.devices,
            }
        case SETTINGS:
            return {
                ...state,
                settings: action.settings,
            }
        case SYSTEM_LOGS:
            return {
                ...state,
                systemLogs: action.systemLogs,
            }
        case ACTION_LOGS:
            return {
                ...state,
                actionLogs: action.actionLogs,
            }
        case SCAN_STATUS:
            return {
                ...state,
                scanStatus: action.scanStatus,
            }
        default:
            return state;
    }
};
