import { Request } from 'express';
import { AuthToken } from './auth-token';

export interface AuthenticatedRequest extends Request {
  token?: AuthToken;
}
