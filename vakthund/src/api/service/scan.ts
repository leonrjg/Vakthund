import { Inject, Service } from 'typedi';
import { ChildProcess } from 'child_process';
import express from 'express';
import { ExecutionRepository } from '../repository/execution';
import { CommandExecutor } from './command-executor';

import fs from 'fs';

@Service()
export class ScanService {
  static getScanCommand(): string {
    const containerizedPath = '/app/engine/main.py';
    let enginePath = containerizedPath;
    if (!fs.existsSync(containerizedPath)) {
      enginePath = '../vakthund-engine/main.py';
    }
    return process.env.ENGINE_CMD ?? `python3 ${enginePath}`;
  }

  private executionRepo: ExecutionRepository;

  private commandExecutor: CommandExecutor;

  private runningProcess: ChildProcess | null = null;

  private runningExecutionId: number | null = null;

  constructor(
    @Inject() executionRepo: ExecutionRepository,
    @Inject() commandExecutor: CommandExecutor,
  ) {
    this.executionRepo = executionRepo;
    this.commandExecutor = commandExecutor;
  }

  isRunning = (): boolean => {
    return this.runningProcess !== null;
  };

  getRunningExecutionId = (): number | null => {
    return this.runningExecutionId;
  };

  runScan = async (res: express.Response): Promise<number> => {
    if (this.isRunning()) {
      throw new Error('A scan is already running');
    }

    const { executionId, childProcess } = await this.commandExecutor.execute({
      command: ScanService.getScanCommand(),
      type: 'scan',
      response: res,
      onStart: (id) => {
        this.runningExecutionId = id;
      },
      onClose: () => {
        this.runningProcess = null;
        this.runningExecutionId = null;
      },
    });

    this.runningProcess = childProcess;

    return executionId;
  };

  streamExecution = async (res: express.Response, executionId: number) => {
    const execution = await this.executionRepo.getModel().findByPk(executionId);

    if (!execution) {
      throw new Error('Execution not found');
    }

    // If the execution is not running, just send the stored result
    if (execution.status !== 'running') {
      if (execution.result) {
        const lines = execution.result.split('\n');
        for (const line of lines) {
          this.echo(res, line);
        }
      }
      res.end();
      return;
    }

    // If this is the running execution, we would need to attach to the running process ideally
    if (this.runningExecutionId === executionId && this.runningProcess) {
      this.echo(res, 'Scan is currently running. Please wait...');
      res.end();
    } else {
      this.echo(res, `Execution status: ${execution.status}`);
      res.end();
    }
  };

  private echo(response: express.Response, buffer: string): void {
    response.write(`data: ${JSON.stringify(buffer)}\n\n`);
  }
}
