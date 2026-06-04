import express from 'express';
export type RequestHandler = (req: express.Request, res: express.Response , next?: express.NextFunction) => void | Promise<void>;