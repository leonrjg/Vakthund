import { Inject, Service } from 'typedi';
import { exec, ChildProcess } from 'child_process';
import express from 'express';
import { ExecutionRepository } from '../repository/execution';

export interface ExecuteOptions {
  command: string;
  type: 'action' | 'scan';
  actionId?: number;
  discoveryId?: number;
  response?: express.Response;
  onStart?: (executionId: number) => void;
  onClose?: (success: boolean) => void;
}

export interface ExecuteResult {
  executionId: number;
  childProcess: ChildProcess;
}

@Service()
export class CommandExecutor {
  private executionRepo: ExecutionRepository;

  constructor(@Inject() executionRepo: ExecutionRepository) {
    this.executionRepo = executionRepo;
  }

  async execute(options: ExecuteOptions): Promise<ExecuteResult> {
    const {
      command,
      type,
      actionId,
      discoveryId,
      response,
      onStart,
      onClose,
    } = options;

    // Create execution record before starting
    const execution = await this.executionRepo.getModel().create({
      execution_date: new Date(),
      success: false,
      result: '',
      type,
      status: 'running',
      action_id: actionId,
      discovery_id: discoveryId,
    });

    if (onStart) {
      onStart(execution.id);
    }

    let result = '';

    // Echo command being run
    result += this.echo(response, `> ${command}`);

    const childProcess = exec(command, { windowsHide: true });

    childProcess.stdout?.on('data', (data: string) => {
      result += this.echo(response, data.toString().trim());
    });

    childProcess.stderr?.on('data', (data: string) => {
      result += this.echo(response, data.toString().trim());
    });

    childProcess.on('close', async (code: number | null) => {
      const success = code === 0;

      await this.executionRepo.getModel().update(
        {
          success,
          result,
          status: success ? 'completed' : 'failed',
        },
        { where: { id: execution.id } },
      );

      if (onClose) {
        onClose(success);
      }

      if (response) {
        response.end();
      }
    });

    return {
      executionId: execution.id,
      childProcess,
    };
  }

  private echo(response: express.Response | undefined, buffer: string): string {
    if (response) {
      response.write(`data: ${JSON.stringify(buffer)}\n\n`);
    }
    return `${buffer}\n`;
  }
}
