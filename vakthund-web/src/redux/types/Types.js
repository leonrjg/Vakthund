export const ALL_DISCOVERIES = "ALLdeviceS";
export const DEVICE_DETAIL = "device_DETAIL";
export const DISCOVERY_DETAIL = "discovery_DETAIL";
export const BACKEND_URL_PREFIX = "http://localhost:18001"
export const DISCOVERY_ALL_URL = `${BACKEND_URL_PREFIX}/api/discovery/all`;
export const DISCOVERY_DETAIL_URL = (id) =>
    `${BACKEND_URL_PREFIX}/api/discovery/${id}`;
export const DEVICE_ALL = "device_all";
export const SETTINGS = "settings";
export const DEVICE_URL = `${BACKEND_URL_PREFIX}/api/device`;
export function getDeviceURL(id) {
    return `${DEVICE_URL}/${id}`;
}

export function getActionURL(id) {
    return `${ACTION_URL}/${id}`;
}
export const DEVICE_ALL_URL = DEVICE_URL + `/all`;
export const SETTINGS_URL = `${BACKEND_URL_PREFIX}/api/settings`;
export const ACTION_URL = `${BACKEND_URL_PREFIX}/api/device/action`;
export function getActionExecuteURL(discoveryId, actionId) {
    return `${BACKEND_URL_PREFIX}/api/discovery/${discoveryId}/action/${actionId}`;
}
