import { Inject, Service } from 'typedi';
import { exec, ChildProcess } from 'child_process';
import express from 'express';
import { ExecutionRepository } from '../repository/execution';
import path from 'path';

@Service()
export class ScanService {

  executionRepo: ExecutionRepository;

  private runningProcess: ChildProcess | null = null;

  private runningExecutionId: number | null = null;

  constructor(@Inject() executionRepo: ExecutionRepository) {
    this.executionRepo = executionRepo;
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

    // Create execution record first
    const execution = await this.executionRepo.getModel().create({
      execution_date: new Date(),
      success: false,
      result: '',
      type: 'scan',
      status: 'running',
    });

    this.runningExecutionId = execution.id;

    let result = '';

    // Determine engine path - in Docker it's at /app/engine, locally it's relative to project root
    const enginePath = process.env.ENGINE_PATH || '/app/engine/main.py';
    const cmd = `python3 ${enginePath}`;

    result += this.echo(res, `> Starting scan...`);
    result += this.echo(res, `> ${cmd}`);

    this.runningProcess = exec(cmd, { windowsHide: true });

    this.runningProcess.stdout?.on('data', (data) => {
      result += this.echo(res, data.toString().trim());
    });

    this.runningProcess.stderr?.on('data', (data) => {
      result += this.echo(res, data.toString().trim());
    });

    this.runningProcess.on('close', async (code) => {
      const success = code === 0;

      await this.executionRepo.getModel().update(
        {
          success,
          result,
          status: success ? 'completed' : 'failed',
        },
        { where: { id: execution.id } }
      );

      this.runningProcess = null;
      this.runningExecutionId = null;

      res.end();
    });

    return execution.id;
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

    // If this is the running execution, we need to attach to the running process
    // This is a simplification - in production you might want to use a more robust streaming solution
    if (this.runningExecutionId === executionId && this.runningProcess) {
      // The process is already streaming to the original response
      // For now, just indicate it's running
      this.echo(res, 'Scan is currently running. Please wait...');
      res.end();
    } else {
      this.echo(res, 'Execution status: ' + execution.status);
      res.end();
    }
  };

  private echo(response: express.Response, buffer: string): string {
    response.write(`data: ${JSON.stringify(buffer)}\n\n`);
    return buffer + '\n';
  }

}
