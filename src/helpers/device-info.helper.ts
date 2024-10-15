import { Request } from 'express';

export const getDeviceInfo = (req: Request): string => {
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  return userAgent || ip || 'Unknown device';
};
