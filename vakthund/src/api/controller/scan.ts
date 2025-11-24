import express from 'express';
import { Container } from 'typedi';
import { ScanService } from '../service/scan';

const router = express.Router();

const scanService = Container.get(ScanService);

// Check if a scan is currently running
router.get<{}, any>('/status', async (req, res) => {
  res.json({
    running: scanService.isRunning(),
    executionId: scanService.getRunningExecutionId(),
  });
});

// Run a new scan - returns execution ID and streams output via SSE
router.post<{}, any>('/run', async (req, res) => {
  // Required headers for Server Side Events (real-time CLI output)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');

  try {
    await scanService.runScan(res);
  } catch (error: any) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Stream output for a specific execution
router.get<{}, any>('/stream/:id', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');

  try {
    // @ts-ignore
    await scanService.streamExecution(res, parseInt(req.params.id));
  } catch (error: any) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

export default router;
