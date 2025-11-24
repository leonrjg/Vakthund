import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';

export const createMigrator = (sequelize: Sequelize) => {
  // Use .js extension in production (compiled), .ts in development
  const ext = __filename.endsWith('.ts') ? 'ts' : 'js';

  return new Umzug({
    migrations: {
      glob: path.join(__dirname, `./*.migration.${ext}`),
      resolve: ({ name, path: migrationPath, context }) => {
        const migration = require(migrationPath!);
        return {
          name,
          up: async () => migration.up(context),
          down: async () => migration.down(context),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
};

export const runMigrations = async (sequelize: Sequelize) => {
  const migrator = createMigrator(sequelize);
  await migrator.up();
};
