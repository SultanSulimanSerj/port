import * as bcrypt from 'bcryptjs';
import { db, users, companies, memberships } from './index';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create a test company
    const [company] = await db
      .insert(companies)
      .values({
        name: 'Acme Corp',
        slug: 'acme-corp',
      })
      .returning();

    console.log('✅ Created company:', company.name);

    // Create test users
    const passwordHash = await bcrypt.hash('password123', 12);

    const testUsers = [
      {
        email: 'owner@acme.com',
        passwordHash,
        firstName: 'John',
        lastName: 'Owner',
        role: 'OWNER',
      },
      {
        email: 'admin@acme.com',
        passwordHash,
        firstName: 'Jane',
        lastName: 'Admin',
        role: 'ADMIN',
      },
      {
        email: 'pm@acme.com',
        passwordHash,
        firstName: 'Bob',
        lastName: 'Manager',
        role: 'PM',
      },
      {
        email: 'engineer@acme.com',
        passwordHash,
        firstName: 'Alice',
        lastName: 'Engineer',
        role: 'WORKER',
      },
      {
        email: 'viewer@acme.com',
        passwordHash,
        firstName: 'Charlie',
        lastName: 'Viewer',
        role: 'VIEWER',
      },
    ];

    for (const userData of testUsers) {
      const { role, ...userFields } = userData;
      
      const [user] = await db
        .insert(users)
        .values(userFields)
        .returning();

      await db.insert(memberships).values({
        userId: user.id,
        companyId: company.id,
        role,
      });

      console.log(`✅ Created user: ${user.email} with role ${role}`);
    }

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seed;