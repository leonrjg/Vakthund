import { BaseRepository } from './base';
import { Service, Inject } from 'typedi';
import Device, { DeviceMap } from './models/device';

@Service()
export class DeviceRepository {
  baseRepo: BaseRepository;

  constructor(@Inject() baseRepo: BaseRepository) {
    this.baseRepo = baseRepo;
    console.log(this.baseRepo.getConnection().authenticate());
  }

  getModel = () => {
    return Device;
  };
}