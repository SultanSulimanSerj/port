import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE_CONNECTION } from '../database/database.module';
import { companies, memberships } from '../database/schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
  ) {}

  async getCompanyById(companyId: string) {
    return this.db.query.companies.findFirst({
      where: eq(companies.id, companyId),
      with: {
        memberships: {
          with: {
            user: true,
          },
        },
      },
    });
  }

  async getCompanyMembers(companyId: string) {
    return this.db.query.memberships.findMany({
      where: eq(memberships.companyId, companyId),
      with: {
        user: true,
      },
    });
  }

  async updateCompany(companyId: string, updates: Partial<typeof companies.$inferInsert>) {
    const [updatedCompany] = await this.db
      .update(companies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companies.id, companyId))
      .returning();

    return updatedCompany;
  }
}