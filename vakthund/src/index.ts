import 'reflect-metadata';
import Container from 'typedi';
import app from './app';
import { BaseRepository } from './api/repository/base';
import { runMigrations } from './api/repository/migrations';
import { SchedulerService } from './api/service/scheduler';

const port = process.env.PORT || 18001;

const start = async () => {
  // Initialize database connection and run migrations
  const baseRepo = Container.get(BaseRepository);
  const conn = baseRepo.getConnection();

  try {
    await runMigrations(conn);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }

  // Initialize the scheduler for periodic scans
  const scheduler = Container.get(SchedulerService);
  try {
    await scheduler.initialize();
  } catch (error) {
    console.error('Scheduler initialization failed:', error);
  }

  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
  });
};

start();
