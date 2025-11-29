import { Inject, Service } from 'typedi';
import cron, { ScheduledTask } from 'node-cron';
import { SettingsService } from './settings';
import { CommandExecutor } from './command-executor';
import { ScanService } from './scan';

const DEFAULT_CRON_EXPRESSION = '0 */12 * * *';

@Service()
export class SchedulerService {
  private settingsService: SettingsService;

  private commandExecutor: CommandExecutor;

  private scheduledTask: ScheduledTask | null = null;

  private currentCronExpression: string | null = null;

  constructor(
    @Inject() settingsService: SettingsService,
    @Inject() commandExecutor: CommandExecutor,
  ) {
    this.settingsService = settingsService;
    this.commandExecutor = commandExecutor;
  }

  async initialize(): Promise<void> {
    const settings = await this.settingsService.getSettings();
    const cronExpression = settings.scan.schedule ?? DEFAULT_CRON_EXPRESSION;
    this.scheduleScans(cronExpression);
  }

  async refreshSchedule(): Promise<void> {
    const settings = await this.settingsService.getSettings();
    const cronExpression = settings.scan.schedule ?? DEFAULT_CRON_EXPRESSION;

    if (cronExpression !== this.currentCronExpression) {
      this.scheduleScans(cronExpression);
    }
  }

  private scheduleScans(cronExpression: string): void {
    // Stop existing task if any
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      this.scheduledTask = null;
    }

    this.scheduledTask = cron.schedule(cronExpression, () => {
      this.runScheduledScan();
    });

    this.currentCronExpression = cronExpression;
    console.log(`Scheduled scans with cron "${cronExpression}"`);
  }

  private async runScheduledScan(): Promise<void> {
    console.log('Starting scheduled scan...');

    await this.commandExecutor.execute({
      command: ScanService.getScanCommand(),
      type: 'scan',
      onClose: (success) => {
        console.log(`Scheduled scan ${success ? 'completed successfully' : 'failed'}`);
      },
    });
  }
}
