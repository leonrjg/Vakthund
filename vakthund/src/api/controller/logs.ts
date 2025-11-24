import express from 'express';
import { Container } from 'typedi';
import { Op } from 'sequelize';
import { ExecutionRepository } from '../repository/execution';
import Action from '../repository/models/action';
import Discovery from '../repository/models/discovery';
import Device from '../repository/models/device';

const router = express.Router();

const executionRepo = Container.get(ExecutionRepository);

// Get all system logs (scan executions)
router.get<{}, any>('/system', async (req, res) => {
  const executions = await executionRepo.getModel().findAll({
    where: { type: 'scan' },
    order: [['execution_date', 'DESC']],
  });
  res.json(executions);
});

// Get all action logs (discovery action executions)
router.get<{}, any>('/actions', async (req, res) => {
  const executions = await executionRepo.getModel().findAll({
    where: {
      [Op.or]: [
        { type: 'action' },
        { type: null },
      ],
    },
    include: [
      {
        model: Action,
        include: [{ model: Device }],
      },
      {
        model: Discovery,
      },
    ],
    order: [['execution_date', 'DESC']],
  });
  res.json(executions);
});

// Get a specific execution by ID
router.get<{}, any>('/:id', async (req, res) => {
  const execution = await executionRepo.getModel().findByPk(
    // @ts-ignore
    parseInt(req.params.id),
    {
      include: [
        {
          model: Action,
          include: [{ model: Device }],
        },
      ],
    }
  );
  res.json(execution);
});

export default router;
