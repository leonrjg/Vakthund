import { Inject, Service } from 'typedi';
import { ActionRepository } from '../repository/action';
import { exec, spawn } from 'child_process';
import express from 'express';
import { DiscoveryService } from './discovery';
import { ExecutionRepository } from '../repository/execution';
import { EOL } from 'os';

@Service()
export class ActionService {

  actionRepo: ActionRepository;

  discoveryService: DiscoveryService;

  executionRepo: ExecutionRepository;

  constructor(@Inject() actionRepo: ActionRepository,
    @Inject() discoveryService: DiscoveryService,
    @Inject() executionRepo: ExecutionRepository) {
    this.actionRepo = actionRepo;
    this.executionRepo = executionRepo;
    this.discoveryService = discoveryService;
  }

  executeAction = async (res: express.Response, targetId: number, id: number) => {
    const action = await this.getActionById(id);
    if (action == null) {
      throw new Error('Action not found');
    }

    const discovery = await this.discoveryService.getDiscoveryById(targetId);
    if (discovery == null) {
      throw new Error('Discovery not found');
    }

    // @ts-ignore
    const cmd = action.cmd.replace(
      /%url|%ip/g,
      (match: any) => {
        switch (match) {
          case '%url':
            return discovery.url;
          case '%ip':
            return discovery.ip;
          default:
            return match;
        }
      },
    );

    this.sendMsg(res, `> ${cmd}`);

    const childProcess = exec(cmd);

    childProcess.stdout?.on('data', (data) => {
      this.sendMsg(res, data.toString().trim());
    });

    childProcess.stderr?.on('data', (data) => {
      this.sendMsg(res, data.toString().trim());
    });

    childProcess.on('close', (code) => {
      const success = code === 0;

      this.executionRepo.getModel().create({
        'action_id': id, 'discovery_id': targetId, 'execution_date': new Date(), 'success': success,
      });

      res.end();
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
      'device_id': body.device_id,
      'title': body.title,
      'cmd': body.cmd,
    });
  };

  putAction = async (id: number, body: any) => {
    return this.actionRepo.getModel().findOne({ where: { id: id } }).then(action => {
      action?.set(body);
      action?.save();
    });
  };

  private sendMsg(response: any, buffer: any) {
    response.write(`data: ${JSON.stringify(buffer)}\n\n`);
  }

}