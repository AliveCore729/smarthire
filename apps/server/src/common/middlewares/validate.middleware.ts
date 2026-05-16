import { AnyZodObject } from 'zod';

import { NextFunction, Request, Response } from 'express';

export const validate =
  (schema: AnyZodObject) =>
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }
  };