import { Service, Inject } from 'typedi';
import { ActionRepository } from '../repository/action';
import { spawn } from 'child_process';
import express from 'express';
import { DiscoveryService } from './discovery';
import { ExecutionRepository } from '../repository/execution';

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

    res.write(`> ${cmd}\n`);

    const childProcess = spawn(cmd, { shell: true });

    childProcess.stdout.on('data', (data) => {
      this.sendMsg(res, data.toString().trim());
    });

    childProcess.stderr.on('data', (data) => {
      this.sendMsg(res, data.toString().trim());
    });

    childProcess.on('close', (code) => {
      res.end();
      const success = code === 0;

      // @ts-ignore
      const tag = success ? action.on_success_tag : action.on_failure_tag;

      if (tag) {
        const tags = (discovery.tags || '').split(',').filter(Boolean);
        const tagIndex = tags.indexOf(`!${tag}`);

        if (tagIndex !== -1) {
          tags.splice(tagIndex, 1);
        }

        tags.push(tag);
      }
      
      this.executionRepo.getModel().create({
        'action_id': id, 'discovery_id': targetId, 'execution_date': new Date(), 'success': success,
      });
    });
  };

  sendMsg(response: any, buffer: any) {
    response.write(`data: ${buffer}\n\n`);
  }

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

}