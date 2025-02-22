
export default interface DeviceDTO {
  name: string;
  queries?: {
    query: string;
    engine: string;
    enabled?: boolean;
  }[];
}

export function toModel(device: any): {
  name: string;
} {
  return {
    name: device.name,
  };
}

export function toQueryModel(device_id: number, device: DeviceDTO): any[] {
  return device.queries?.map(q => {
    return {
      device_id: device_id,
      query: q.query,
      engine: q.engine,
      enabled: q.enabled !== false,
    };
  }) || [];
}
