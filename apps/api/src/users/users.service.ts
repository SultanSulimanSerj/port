import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import { users } from '../database/schemas';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_CONNECTION) private db: any) {}

  async findById(id: string) {
    return this.db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        memberships: {
          with: {
            company: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        memberships: {
          with: {
            company: true,
          },
        },
      },
    });
  }
}