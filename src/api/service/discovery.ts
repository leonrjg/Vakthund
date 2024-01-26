import { DiscoveryRepository } from '../repository/discovery';
import { Service, Inject } from 'typedi';
import { ActionRepository } from '../repository/action';
import { ExecutionRepository } from '../repository/execution';
import DiscoveryDTO, { toModel } from '../../interfaces/DiscoveryDTO';
import { Op } from 'sequelize';
import Device from '../repository/models/device';
import Action from '../repository/models/action';

@Service()
export class DiscoveryService {
  discoveryRepo: DiscoveryRepository;

  actionRepo: ActionRepository;
  
  executionRepo: ExecutionRepository;

  constructor(@Inject() discoveryRepo: DiscoveryRepository,
    @Inject() actionRepo: ActionRepository,
    @Inject() executionRepo: ExecutionRepository) {
    this.discoveryRepo = discoveryRepo;
    this.actionRepo = actionRepo;
    this.executionRepo = executionRepo;
  }

  getDiscoveries = async () => {
    return this.discoveryRepo.getModel().findAll({
      include: [
        { model: Device },
      ],
    });
  };

  getDiscovery = async (id: number) => {
    const discovery = await this.discoveryRepo.getModel().findOne({
      where: {
        id: id,
      },
      include: [
        { model: Device },
      ],
    });
    return {
      'actions': await this.getActions(<number>discovery?.device_id),
      'executions': await this.getExecutions(id),
      'details': discovery,
    };
  };

  getDiscoveryById = async (id: number) => {
    return this.discoveryRepo.getModel().findOne({
      where: {
        id: id,
      },
    });
  };

  getActions = async (deviceId: number) => {
    return this.actionRepo.getModel().findAll({
      where: {
        [Op.or]: [
          { device_id: deviceId },
          { device_id: null },
        ],
      },
    });
  };

  getExecutions = async (discoveryId: number) => {
    return this.executionRepo.getModel().findAll({
      where: { discovery_id: discoveryId },
      include: [
        { model: Action },
      ],
    });
  };
  
  newDiscovery = async (discovery: DiscoveryDTO) => {
    return this.discoveryRepo.getModel().create(toModel(discovery));
  };
}