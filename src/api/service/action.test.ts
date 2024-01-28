import 'reflect-metadata';
import { ActionService } from './action';
import { mock } from 'jest-mock-extended';
import { ActionRepository } from '../repository/action';
import { DiscoveryService } from './discovery';
import { ExecutionRepository } from '../repository/execution';
import express from 'express';

const actionRepoMock = mock<ActionRepository>();
const discoveryServiceMock = mock<DiscoveryService>();
const executionRepoMock = mock<ExecutionRepository>();

const mockRes = mock<express.Response>();

const actionService = new ActionService(
  actionRepoMock,
  discoveryServiceMock,
  executionRepoMock,
);

describe('ActionService', () => {
  describe('getActionById method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('returns the correct action when it exists', async () => {
      const expectedAction = { id: 1, device_id: 1, title: 'Test', cmd: 'Test' };

      actionRepoMock.getModel.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedAction),
      } as any);

      const action = await actionService.getActionById(1);

      expect(action).toEqual(expectedAction);
    });

    it('returns null when no action found', async () => {
      actionRepoMock.getModel.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      } as any);

      const action = await actionService.getActionById(2);

      expect(action).toBeNull();
    });
  });

  describe('ActionService - executeAction', () => {
    it('should successfully execute an action', async () => {
      const mockAction = { id: 1, cmd: 'echo a' };
      const mockDiscovery = { id: 2, url: 'https://example.com', ip: '127.0.0.1' };
      actionRepoMock.getModel.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockAction),
      } as any);
      // @ts-ignore
      discoveryServiceMock.getDiscoveryById.mockResolvedValue(mockDiscovery);
      executionRepoMock.getModel.mockReturnValue({
        create: jest.fn().mockReturnValue(null),
      } as any);

      await actionService.executeAction(mockRes, 2, 1);
      expect(mockRes.write).toHaveBeenCalledWith(`data: ${JSON.stringify(`> ${mockAction.cmd}`)}\n\n`);
    });

    it('should throw an error when action is not found', async () => {
      actionRepoMock.getModel.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(actionService.executeAction(mockRes, 2, 1)).rejects.toThrow('Action not found');
    });

    it('should throw an error when discovery is not found', async () => {
      const mockAction = { id: 1, cmd: 'ping %ip' };
      actionRepoMock.getModel.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockAction),
      } as any);
      discoveryServiceMock.getDiscoveryById.mockResolvedValue(null);

      await expect(actionService.executeAction(mockRes, 2, 1)).rejects.toThrow('Discovery not found');
    });
  });

});