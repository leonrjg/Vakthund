
export default interface DeviceDTO {
  name: string;
  query?: string;
  engine?: string;
}

export function toModel(device: any): {
  name: string;
} {
  return {
    name: device.name,
  };
}

export function toQueryModel(device_id: number, device: any): {
  device_id: number
  query: string;
  engine: string;
} {
  return {
    device_id: device_id,
    query: device.query,
    engine: device.engine,
  };
}
