import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { eq, sql } from 'drizzle-orm';

import { DATABASE_CONNECTION } from '../../database/database.module';
import { users, memberships } from '../../database/schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      return false;
    }

    // Get user's company membership
    const membership = await this.db.query.memberships.findFirst({
      where: eq(memberships.userId, user.id),
      with: {
        company: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('User has no company membership');
    }

    // Set company context in request
    request.companyId = membership.companyId;
    request.userRole = membership.role;

    // Set PostgreSQL session variable for RLS
    await this.db.execute(sql`SET app.company_id = ${membership.companyId}`);
    await this.db.execute(sql`SET app.user_id = ${user.id}`);

    return true;
  }
}