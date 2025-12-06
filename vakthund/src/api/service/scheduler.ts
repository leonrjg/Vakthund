import { Inject, Service } from 'typedi';
import cron, { ScheduledTask } from 'node-cron';
import { SettingsService } from './settings';
import { CommandExecutor } from './command-executor';
import { ScanService } from './scan';

const DEFAULT_CRON_EXPRESSION = '0 */12 * * *';
const DEFAULT_TIMEZONE = 'Etc/UTC';

@Service()
export class SchedulerService {
  private settingsService: SettingsService;

  private commandExecutor: CommandExecutor;

  constructor(
    @Inject() settingsService: SettingsService,
    @Inject() commandExecutor: CommandExecutor,
  ) {
    this.settingsService = settingsService;
    this.commandExecutor = commandExecutor;
  }

  async initialize(): Promise<void> {
    const settings = await this.settingsService.getSettings();
    this.scheduleScans(settings);
  }

  public getNextRun(): Date | null | undefined {
    const tasks = Array.from(cron.getTasks().values());
    return tasks.length > 0 ? tasks[0].getNextRun() : null;
  }

  private scheduleScans(settings: any): void {
    const cronExpression = settings.scan.schedule ?? DEFAULT_CRON_EXPRESSION;
    const timezone = settings.preferences?.timezone ?? DEFAULT_TIMEZONE;

    // Clear existing scheduled tasks
    this.clearTasks();

    cron.schedule(cronExpression, () => { this.runScheduledScan() },
        {timezone: timezone, name: 'scan'}
    );

    console.log(`Scheduled scans with cron "${cronExpression}" in timezone "${timezone}"`);
  }

  private clearTasks(): void {
    cron.getTasks().forEach((task) => {
      try { task.stop(); task.destroy() } catch (_) { }
    });
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
