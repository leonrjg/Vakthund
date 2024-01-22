import { BaseRepository } from './base';
import { Service, Inject } from 'typedi';
import Execution, { ExecutionMap } from '../../models/execution';

@Service()
export class ExecutionRepository {
  baseRepo: BaseRepository;

  constructor(@Inject() baseRepo: BaseRepository) {
    this.baseRepo = baseRepo;
  }

  getModel = () => {
    return Execution;
  };
}