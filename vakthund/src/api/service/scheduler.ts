import { Inject, Service } from 'typedi';
import cron, { ScheduledTask } from 'node-cron';
import { SettingsService } from './settings';
import { CommandExecutor } from './command-executor';
import { ScanService } from './scan';

const DEFAULT_INTERVAL_MINUTES = 1440;

@Service()
export class SchedulerService {
  private settingsService: SettingsService;

  private commandExecutor: CommandExecutor;

  private scheduledTask: ScheduledTask | null = null;

  private currentIntervalMinutes: number | null = null;

  constructor(
    @Inject() settingsService: SettingsService,
    @Inject() commandExecutor: CommandExecutor,
  ) {
    this.settingsService = settingsService;
    this.commandExecutor = commandExecutor;
  }

  async initialize(): Promise<void> {
    const settings = await this.settingsService.getSettings();
    const intervalMinutes = settings.scan_interval_in_minutes ?? DEFAULT_INTERVAL_MINUTES;
    this.scheduleScans(intervalMinutes);
  }

  async refreshSchedule(): Promise<void> {
    const settings = await this.settingsService.getSettings();
    const intervalMinutes = settings.scan_interval_in_minutes ?? DEFAULT_INTERVAL_MINUTES;

    if (intervalMinutes !== this.currentIntervalMinutes) {
      this.scheduleScans(intervalMinutes);
    }
  }

  private scheduleScans(intervalMinutes: number): void {
    // Stop existing task if any
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      this.scheduledTask = null;
    }

    // Interval of 0 or negative disables scheduling
    if (intervalMinutes <= 0) {
      console.log('Scheduled scans disabled (interval <= 0)');
      this.currentIntervalMinutes = intervalMinutes;
      return;
    }

    // Convert minutes to cron expression
    const cronExpression = this.minutesToCron(intervalMinutes);

    this.scheduledTask = cron.schedule(cronExpression, () => {
      this.runScheduledScan();
    });

    this.currentIntervalMinutes = intervalMinutes;
    console.log(`Scheduled scans every ${intervalMinutes} minutes (cron: ${cronExpression})`);
  }

  private minutesToCron(minutes: number): string {
    if (minutes < 60) {
      // Every N minutes
      return `*/${minutes} * * * *`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      // Every N hours
      return `0 */${hours} * * *`;
    }

    const days = Math.floor(hours / 24);
    // Every N days at midnight
    return `0 0 */${days} * *`;
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
