import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import { companies, memberships } from '../database/schemas';

@Injectable()
export class CompaniesService {
  constructor(@Inject(DATABASE_CONNECTION) private db: any) {}

  async findById(id: string) {
    return this.db.query.companies.findFirst({
      where: eq(companies.id, id),
      with: {
        memberships: {
          with: {
            user: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.db.query.companies.findFirst({
      where: eq(companies.slug, slug),
    });
  }

  async getMembers(companyId: string) {
    return this.db.query.memberships.findMany({
      where: eq(memberships.companyId, companyId),
      with: {
        user: true,
      },
    });
  }
}