import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // or number, based on your logic
    }
  }
}