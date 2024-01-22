import { BaseRepository } from './base';
import { Service, Inject } from 'typedi';
import Action, { ActionMap } from '../../models/action';

@Service()
export class ActionRepository {
  baseRepo: BaseRepository;

  constructor(@Inject() baseRepo: BaseRepository) {
    this.baseRepo = baseRepo;
  }

  getModel = () => {
    return Action;
  };
}