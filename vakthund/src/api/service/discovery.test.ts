import 'reflect-metadata';
import { DiscoveryService } from './discovery';
import { mock } from 'jest-mock-extended';
import { DiscoveryRepository } from '../repository/discovery';
import { ActionRepository } from '../repository/action';
import { ExecutionRepository } from '../repository/execution';
import { BaseRepository } from '../repository/base';
import Device from '../repository/models/device';
import Action from '../repository/models/action';
import { toModel } from '../../interfaces/DiscoveryDTO';

describe('DiscoveryService', () => {
  let discoveryService: DiscoveryService;
  let mockedDiscoveryRepository: DiscoveryRepository;
  let mockedActionRepository: ActionRepository;
  let mockedExecutionRepository: ExecutionRepository;

  beforeEach(() => {
    let baseRepo = mock<BaseRepository>();
    mockedDiscoveryRepository = {
      baseRepo: baseRepo,
      getModel: jest.fn().mockReturnValue({
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
      }),
    };
    mockedActionRepository = {
      baseRepo: baseRepo,
      getModel: jest.fn().mockReturnValue({
        findAll: jest.fn(),
      }),
    };
    mockedExecutionRepository = {
      baseRepo: baseRepo,
      getModel: jest.fn().mockReturnValue({
        findAll: jest.fn(),
      }),
    };

    discoveryService = new DiscoveryService(
      mockedDiscoveryRepository,
      mockedActionRepository,
      mockedExecutionRepository,
    );
  });

  describe('getDiscoveries', () => {
    it('should return all discoveries with included Device model', async () => {
      const mockDiscovery = { id: 1 };
      mockedDiscoveryRepository.getModel().findAll = jest.fn().mockResolvedValue([mockDiscovery]);

      const discoveries = await discoveryService.getDiscoveries();

      expect(discoveries).toEqual([mockDiscovery]);

      expect(mockedDiscoveryRepository.getModel().findAll).toBeCalledWith({
        include: [
          { model: Device },
        ],
      });
    });
  });

  describe('getDiscovery', () => {
    it('should return a single Discovery when provided an id', async () => {
      const mockDiscovery = { id: 1, device_id: 2 };
      const mockAction = { dataValues: { id: 1, device_id: 2 }, cmd: 'echo test' };
      const mockExecution = { id: 1, discovery_id: 1 };
      mockedDiscoveryRepository.getModel().findOne = jest.fn().mockResolvedValue(mockDiscovery);
      mockedActionRepository.getModel().findAll = jest.fn().mockResolvedValue([mockAction]);
      mockedExecutionRepository.getModel().findAll = jest.fn().mockResolvedValue([mockExecution]);

      const discovery = await discoveryService.getDiscovery(1);

      expect(discovery).toEqual({
        'actions': [{ id: 1, device_id: 2, has_prompt: false }],
        'executions': [mockExecution],
        'details': mockDiscovery,
      });
    });
  });

  describe('getDiscoveryById', () => {
    it('should return a single Discovery when provided an id', async () => {
      const mockDiscovery = { id: 1 };
      mockedDiscoveryRepository.getModel().findOne = jest.fn().mockResolvedValue(mockDiscovery);

      const discovery = await discoveryService.getDiscoveryById(1);

      expect(discovery).toEqual(mockDiscovery);
    });
  });

  describe('getActions', () => {
    it('should return actions by deviceId', async () => {
      const mockAction = { dataValues: { id: 1, device_id: 1 }, cmd: 'echo %prompt' };
      mockedActionRepository.getModel().findAll = jest.fn().mockResolvedValue([mockAction]);

      const actions = await discoveryService.getActions(1);

      expect(actions).toEqual([{ id: 1, device_id: 1, has_prompt: true }]);
    });
  });

  describe('getExecutions', () => {
    it('should return executions by discoveryId with included Action model', async () => {
      const mockExecution = { id: 1, discovery_id: 1 };
      mockedExecutionRepository.getModel().findAll = jest.fn().mockResolvedValue([mockExecution]);

      const executions = await discoveryService.getExecutions(1);

      expect(executions).toEqual([mockExecution]);
      expect(mockedExecutionRepository.getModel().findAll).toBeCalledWith({
        where: { discovery_id: 1 },
        include: [
          { model: Action },
        ],
      });
    });
  });

  describe('newDiscovery', () => {
    it('should create a new discovery and return it', async () => {
      const mockDiscovery = { id: 1 };
      mockedDiscoveryRepository.getModel().create = jest.fn().mockResolvedValue(mockDiscovery);

      let dto = { device_id: 0, ip: '', source: '', url: '' };

      const discovery = await discoveryService.newDiscovery(dto);

      expect(discovery).toEqual(mockDiscovery);
      expect(mockedDiscoveryRepository.getModel().create).toBeCalledWith(
        expect.objectContaining({
          device_id: dto.device_id,
          ip: dto.ip,
          source: dto.source,
          url: dto.url,
        })
      );
    });
  });
});
