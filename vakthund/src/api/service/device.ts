import { Inject, Service } from 'typedi';
import { DeviceRepository } from '../repository/device';
import { toModel, toQueryModel } from '../../interfaces/DeviceDTO';
import { DiscoveryRepository } from '../repository/discovery';
import { QueryRepository } from '../repository/query';
import { BaseRepository } from '../repository/base';
import { ActionRepository } from '../repository/action';
import { Op } from 'sequelize';

@Service()
export class DeviceService {
  baseRepo: BaseRepository;

  deviceRepo: DeviceRepository;

  discoveryRepo: DiscoveryRepository;

  queryRepo: QueryRepository;
  
  actionRepo: ActionRepository;
  
  constructor(@Inject() baseRepo: BaseRepository,
    @Inject() deviceRepo: DeviceRepository, 
    @Inject() discoveryRepo: DiscoveryRepository, 
    @Inject() queryRepo: QueryRepository, 
    @Inject() actionRepo: ActionRepository) {
    this.baseRepo = baseRepo;
    this.deviceRepo = deviceRepo;
    this.discoveryRepo = discoveryRepo;
    this.queryRepo = queryRepo;
    this.actionRepo = actionRepo;
  }

  getDevices = async () => {
    const devices = await this.deviceRepo.getModel().findAll();
    return Promise.all(devices.map(async d => {
      let discoveries = await this.discoveryRepo.getModel().findAndCountAll({ where: { device_id: d.id } });
      const queries = await this.queryRepo.getModel().findAndCountAll({ where: { device_id: d?.id } });
      return { ...d.dataValues, discoveries: discoveries.count, queries: queries.count };
    }));
  };

  getDeviceById = async (id: number) => {
    const device = (await this.deviceRepo.getModel().findByPk(id))?.get();
    const queries = await this.queryRepo.getModel().findAll({ where: { device_id: device?.id } });
    const actions = await this.actionRepo.getModel().findAll({ where: {
        [Op.or]: [{ device_id: device?.id }, { device_id: null }],
      } });
    return { ...device, queries: queries, actions: actions };
  };

  editDevice = async (id: number, body: any) => {
    await this.baseRepo.conn.transaction(async (t: any) => {
      await Promise.all([
          this.deviceRepo.getModel().findByPk(id, { transaction: t }).then(async device => {
            device?.set(body);
            await device?.save({ transaction: t });
          }),

          this.queryRepo.getModel().destroy({
            where: { device_id: id },
            transaction: t
          }),

          this.queryRepo.getModel().bulkCreate(toQueryModel(id, body), { transaction: t }),
      ]);
    });
  };
  
  newDevice = async (body: any) => {
    await this.baseRepo.conn.transaction(async (t) => {
      const deviceCreation = await this.deviceRepo.getModel().create(toModel(body), { transaction: t });
      await this.queryRepo.getModel().bulkCreate(toQueryModel(deviceCreation.id, body), { transaction: t });
    });
  };

  deleteDevice = async (id: number) => {
    return this.deviceRepo.getModel().findByPk(id).then(device => device?.destroy());
  };
}