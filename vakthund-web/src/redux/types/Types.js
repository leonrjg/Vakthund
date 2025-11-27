export const ALL_DISCOVERIES = "ALLdeviceS";
export const DEVICE_DETAIL = "device_DETAIL";
export const DISCOVERY_DETAIL = "discovery_DETAIL";
export const DISCOVERY_UPDATE = "discovery_UPDATE";
export const BACKEND_URL_PREFIX = `http://${window.location.hostname || 'localhost'}:18001`;
export const DISCOVERY_ALL_URL = `${BACKEND_URL_PREFIX}/api/discovery/all`;
export const DISCOVERY_DETAIL_URL = (id) =>
    `${BACKEND_URL_PREFIX}/api/discovery/${id}`;
export const DEVICE_ALL = "device_all";
export const ACTIONS_ALL = "actions_all";
export const SETTINGS = "settings";
export const DEVICE_URL = `${BACKEND_URL_PREFIX}/api/device`;
export const DISCOVERY_URL = `${BACKEND_URL_PREFIX}/api/discovery`;

// Logs
export const SYSTEM_LOGS = "system_logs";
export const ACTION_LOGS = "action_logs";
export const LOGS_URL = `${BACKEND_URL_PREFIX}/api/logs`;
export const SYSTEM_LOGS_URL = `${LOGS_URL}/system`;
export const ACTION_LOGS_URL = `${LOGS_URL}/actions`;

// Scan
export const SCAN_STATUS = "scan_status";
export const SCAN_URL = `${BACKEND_URL_PREFIX}/api/scan`;
export const SCAN_RUN_URL = `${SCAN_URL}/run`;
export const SCAN_STATUS_URL = `${SCAN_URL}/status`;

export function getDiscoveryURL(id) {
    return `${DISCOVERY_URL}/${id}`;
}

export function getDeviceURL(id) {
    return `${DEVICE_URL}/${id}`;
}

export function getActionURL(id) {
    return `${ACTION_URL}/${id}`;
}

export const DEVICE_ALL_URL = DEVICE_URL + `/all`;
export const SETTINGS_URL = `${BACKEND_URL_PREFIX}/api/settings`;
export const ACTION_URL = `${BACKEND_URL_PREFIX}/api/device/action`;
export const ACTION_ALL_URL = ACTION_URL + `/all`;

export function getActionExecuteURL(discoveryId, actionId) {
    return `${BACKEND_URL_PREFIX}/api/discovery/${discoveryId}/action/${actionId}`;
}
