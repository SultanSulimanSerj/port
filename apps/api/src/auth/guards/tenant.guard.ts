import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { JwtPayload } from '@saas-portal/shared';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: any,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user || !user.company_id) {
      throw new ForbiddenException('No company context found');
    }

    // Set company_id in database session for RLS
    await this.db.execute(`SET app.company_id = '${user.company_id}'`);

    return true;
  }
}