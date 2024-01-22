import { BaseRepository } from './base';
import { Service, Inject } from 'typedi';
import Discovery, { DiscoveryMap } from '../../models/discovery';

@Service()
export class DiscoveryRepository {
  baseRepo: BaseRepository;

  constructor(@Inject() baseRepo: BaseRepository) {
    this.baseRepo = baseRepo;
    console.log(this.baseRepo.getConnection().authenticate());
  }

  getModel = () => {
    return Discovery;
  };
}