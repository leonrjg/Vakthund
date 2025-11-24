import 'reflect-metadata';
import { DeviceService } from './device';
import { Transaction } from 'sequelize';
import { BaseRepository } from '../repository/base';
import { DeviceRepository } from '../repository/device';
import { DiscoveryRepository } from '../repository/discovery';
import { QueryRepository } from '../repository/query';
import { ActionRepository } from '../repository/action';
import { toModel } from '../../interfaces/DeviceDTO';
import { mock } from 'jest-mock-extended';

describe('DeviceService', () => {
  let deviceRepo: DeviceRepository;
  let discoveryRepo: DiscoveryRepository;
  let queryRepo: QueryRepository;
  let actionRepo: ActionRepository;
  let service: DeviceService;
  let baseRepo: BaseRepository;

  beforeEach(() => {
    baseRepo = mock<BaseRepository>();
    let mockRepo = {
      baseRepo: baseRepo,
      getModel: jest.fn().mockReturnValue({
        findAll: jest.fn(),
        findByPk: jest.fn(),
      }),
    };
    deviceRepo = mockRepo;
    discoveryRepo = mockRepo;
    queryRepo = mockRepo;
    actionRepo = mockRepo;

    baseRepo.conn = { transaction: jest.fn() } as any;
    service = new DeviceService(baseRepo, deviceRepo, discoveryRepo, queryRepo, actionRepo);
  });

  describe('getDevices', () => {
    it('should return a list of devices with the right format', async () => {
      const dummyDevices = [{ id: 2, dataValues: { id: 2 } }];
      const findAndCountAllMock = jest.fn().mockResolvedValue({ count: 2 });
      deviceRepo.getModel().findAll = jest.fn().mockResolvedValue(dummyDevices);
      discoveryRepo.getModel().findAndCountAll = findAndCountAllMock;
      queryRepo.getModel().findAndCountAll = findAndCountAllMock;

      const result = await service.getDevices();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 2,
            discoveries: 2,
            queries: 2,
          }),
        ]),
      );
    });
  });

  describe('getDeviceById', () => {
    it('should return a device by the provided ID', async () => {
      const device = { id: 1 };
      deviceRepo.getModel().findByPk = jest.fn().mockResolvedValue({ get: () => device });
      queryRepo.getModel().findAll = jest.fn().mockResolvedValue([]);
      actionRepo.getModel().findAll = jest.fn().mockResolvedValue([]);

      const result = await service.getDeviceById(device.id);

      expect(result).toMatchObject(device);
    });
  });

  describe('editDevice', () => {
    it('should edit a device by the provided ID', async () => {
      const id = 1;
      const body = { name: 'new name' };
      // @ts-ignore
      const transactionMock = jest.fn() as unknown as jest.MockedFunction<Transaction>;
      const setMock = jest.fn();
      const saveMock = jest.fn();
      deviceRepo.getModel().findByPk = jest.fn().mockResolvedValue({ set: setMock, save: saveMock });
      queryRepo.getModel().destroy = jest.fn().mockResolvedValue(undefined);
      queryRepo.getModel().bulkCreate = jest.fn().mockResolvedValue([]);
      baseRepo.conn.transaction = jest.fn().mockImplementation(cb => cb(transactionMock));

      await service.editDevice(id, body);

      expect(setMock).toHaveBeenCalledWith(body);
      expect(saveMock).toHaveBeenCalledWith({ transaction: transactionMock });
    });
  });

  describe('newDevice', () => {
    it('should create a new device', async () => {
      const body = { 'name': 'new device', 'engine': 'test', 'query': 'test' };
      // @ts-ignore
      const transactionMock = jest.fn() as unknown as jest.MockedFunction<Transaction>;
      const deviceCreationMock = { id: 1 };
      deviceRepo.getModel().create = jest.fn().mockResolvedValue(deviceCreationMock);
      queryRepo.getModel().bulkCreate = jest.fn().mockResolvedValue([]);
      baseRepo.conn.transaction = jest.fn().mockImplementation(cb => cb(transactionMock));

      await service.newDevice(body);

      expect(deviceRepo.getModel().create).toHaveBeenCalledWith(toModel(body), { transaction: transactionMock });
    });
  });

  describe('deleteDevice', () => {
    it('should delete a device by provided ID', async () => {
      const id = 1;
      const destroyMock = jest.fn();
      deviceRepo.getModel().findByPk = jest.fn().mockResolvedValue({ destroy: destroyMock });

      await service.deleteDevice(id);

      expect(destroyMock).toHaveBeenCalled();
    });
  });
});
