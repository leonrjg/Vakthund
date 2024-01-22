import {ALL_DISCOVERIES, DEVICE_ALL, DISCOVERY_DETAIL, SETTINGS} from "../types/Types";

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
        default:
            return state;
    }
};
