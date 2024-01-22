
export default interface DiscoveryDTO {
  url: string;
  ip: string;
  device_id: number;
  tags?: string;
  comment?: string;
  source: string;
}

export function toModel(discovery: any): {
  ip: string;
  comment?: string;
  source: string;
  device_id: number;
  url: string;
  tags?: string
} {
  return {
    comment: discovery.comment,
    device_id: discovery.device_id,
    ip: discovery.ip,
    source: discovery.source,
    tags: discovery.tags,
    url: discovery.url,
  };
}
