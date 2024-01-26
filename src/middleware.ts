import { NextFunction, Request, Response } from 'express';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(req: Request, res: Response<any>, next: NextFunction) {
  try {
    next();
  } catch (e) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
      'message': '',
      'stack': process.env.NODE_ENV === 'production' ? '' : '',
    });
    console.error(e);
  }
}
