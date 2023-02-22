import { NextFunction, Request, Response } from 'express';

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export default async function (req: Request, res: Response, next: NextFunction) {
  await delay(1000);

  next();
}
