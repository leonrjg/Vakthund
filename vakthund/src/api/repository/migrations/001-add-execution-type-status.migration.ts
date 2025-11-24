import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  const dialect = queryInterface.sequelize.getDialect();

  if (dialect === 'sqlite') {
    // SQLite requires table recreation to change column constraints
    // We'll create a new table with the correct schema and migrate data
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS vakthund_executions_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_id INTEGER,
        discovery_id INTEGER,
        execution_date DATETIME NOT NULL,
        result TEXT,
        success INTEGER NOT NULL,
        type VARCHAR(255) DEFAULT 'action',
        status VARCHAR(255) DEFAULT 'completed'
      );
    `);

    // Copy existing data
    await queryInterface.sequelize.query(`
      INSERT INTO vakthund_executions_new (id, action_id, discovery_id, execution_date, result, success, type, status)
      SELECT id, action_id, discovery_id, execution_date, result, success, 'action', 'completed'
      FROM vakthund_executions;
    `);

    // Drop old table and rename new one
    await queryInterface.sequelize.query(`DROP TABLE vakthund_executions;`);
    await queryInterface.sequelize.query(`ALTER TABLE vakthund_executions_new RENAME TO vakthund_executions;`);
  } else {
    // MySQL/PostgreSQL can alter columns directly
    const tableInfo = await queryInterface.describeTable('vakthund_executions');

    if (!tableInfo['type']) {
      await queryInterface.addColumn('vakthund_executions', 'type', {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'action',
      });
    }

    if (!tableInfo['status']) {
      await queryInterface.addColumn('vakthund_executions', 'status', {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'completed',
      });
    }

    await queryInterface.changeColumn('vakthund_executions', 'action_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('vakthund_executions', 'discovery_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  }
};

export const down = async (queryInterface: QueryInterface) => {
  const dialect = queryInterface.sequelize.getDialect();

  if (dialect === 'sqlite') {
    // Recreate original table structure
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS vakthund_executions_old (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_id INTEGER NOT NULL,
        discovery_id INTEGER NOT NULL,
        execution_date DATETIME NOT NULL,
        result TEXT,
        success INTEGER NOT NULL
      );
    `);

    // Copy data back (only rows with non-null action_id and discovery_id)
    await queryInterface.sequelize.query(`
      INSERT INTO vakthund_executions_old (id, action_id, discovery_id, execution_date, result, success)
      SELECT id, action_id, discovery_id, execution_date, result, success
      FROM vakthund_executions
      WHERE action_id IS NOT NULL AND discovery_id IS NOT NULL;
    `);

    await queryInterface.sequelize.query(`DROP TABLE vakthund_executions;`);
    await queryInterface.sequelize.query(`ALTER TABLE vakthund_executions_old RENAME TO vakthund_executions;`);
  } else {
    await queryInterface.removeColumn('vakthund_executions', 'type');
    await queryInterface.removeColumn('vakthund_executions', 'status');
  }
};
