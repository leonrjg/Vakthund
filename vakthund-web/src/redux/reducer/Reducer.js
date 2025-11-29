import {ALL_DISCOVERIES, DEVICE_ALL, DISCOVERY_DETAIL, DISCOVERY_UPDATE, SETTINGS, SYSTEM_LOGS, ACTION_LOGS, SCAN_STATUS, ACTIONS_ALL} from "../types/Types";

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
        case DISCOVERY_UPDATE:
            // Update both the current discovery details and the discovery in the list
            const updatedDiscoveries = state.discoveries?.map(d =>
                d.id === action.discovery.id ? action.discovery : d
            );
            return {
                ...state,
                discovery: {
                    ...state.discovery,
                    details: action.discovery,
                },
                discoveries: updatedDiscoveries || state.discoveries,
            };
        case DEVICE_ALL:
            return {
                ...state,
                devices: action.devices,
            }
        case ACTIONS_ALL:
            return {
                ...state,
                actions: action.actions,
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
