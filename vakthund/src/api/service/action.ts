import { Inject, Service } from 'typedi';
import { ActionRepository } from '../repository/action';
import express from 'express';
import { DiscoveryService } from './discovery';
import { CommandExecutor } from './command-executor';
import Device from '../repository/models/device';

@Service()
export class ActionService {
  private actionRepo: ActionRepository;

  private discoveryService: DiscoveryService;

  private commandExecutor: CommandExecutor;

  constructor(
    @Inject() actionRepo: ActionRepository,
    @Inject() discoveryService: DiscoveryService,
    @Inject() commandExecutor: CommandExecutor,
  ) {
    this.actionRepo = actionRepo;
    this.discoveryService = discoveryService;
    this.commandExecutor = commandExecutor;
  }

  executeAction = async (res: express.Response, targetId: number, id: number, prompt?: string) => {
    const action = await this.getActionById(id);
    if (action == null) {
      throw new Error('Action not found');
    }

    const discovery = await this.discoveryService.getDiscoveryById(targetId);
    if (discovery == null) {
      throw new Error('Discovery not found');
    }

    // Replace the action's shell command variables with the discovery's values
    const cmd = action.cmd.replace(
      /%url|%ip|%prompt/g,
      (match: any) => {
        switch (match) {
          case '%url':
            return discovery.url;
          case '%ip':
            return discovery.ip;
          case '%prompt':
            return prompt || res.end();
          default:
            return match;
        }
      },
    );

    await this.commandExecutor.execute({
      command: cmd,
      type: 'action',
      actionId: id,
      discoveryId: targetId,
      response: res,
    });
  };

  getActions = async () => {
    return this.actionRepo.getModel().findAll({
      include: [{ model: Device, required: false }],
    });
  };

  getActionById = async (id: number) => {
    return this.actionRepo.getModel().findOne({
      where: {
        id: id,
      },
    });
  };

  postAction = async (body: any) => {
    await this.actionRepo.getModel().create({
      'device_id': body.device_id || null,
      'title': body.title,
      'cmd': body.cmd,
      'execute_on_discovery': !!body.execute_on_discovery,
    });
  };

  putAction = async (id: number, body: any) => {
    return this.actionRepo.getModel().findOne({ where: { id: id } }).then(action => {
      action?.set(body);
      action?.save();
    });
  };

  deleteAction = async (id: number) => {
    return this.actionRepo.getModel().destroy({ where: { id: id } });
  };
}