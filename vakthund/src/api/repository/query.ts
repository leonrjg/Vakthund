import { BaseRepository } from './base';
import { Service, Inject } from 'typedi';
import Query from './models/query';

@Service()
export class QueryRepository {
  baseRepo: BaseRepository;

  constructor(@Inject() baseRepo: BaseRepository) {
    this.baseRepo = baseRepo;
  }

  getModel = () => {
    return Query;
  };
}