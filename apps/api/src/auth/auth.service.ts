import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import { users, companies, memberships } from '../database/schemas';
import { LoginDto, RegisterDto, JwtPayload } from '@saas-portal/shared';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: any,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        memberships: {
          with: {
            company: true,
          },
        },
      },
    });

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Get active membership
    const activeMembership = user.memberships.find((m: any) => m.isActive);
    if (!activeMembership) {
      throw new UnauthorizedException('No active company membership found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      company_id: activeMembership.companyId,
      roles: [activeMembership.role],
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    // Store refresh token
    await this.db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.id, user.id));

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: activeMembership.company,
        role: activeMembership.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, registerDto.email),
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    // Start transaction
    const result = await this.db.transaction(async (tx: any) => {
      // Create user
      const [newUser] = await tx
        .insert(users)
        .values({
          email: registerDto.email,
          passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        })
        .returning();

      // Create company
      const companySlug = this.generateSlug(registerDto.companyName);
      const [newCompany] = await tx
        .insert(companies)
        .values({
          name: registerDto.companyName,
          slug: companySlug,
        })
        .returning();

      // Create membership with OWNER role
      await tx.insert(memberships).values({
        userId: newUser.id,
        companyId: newCompany.id,
        role: 'OWNER',
      });

      return { user: newUser, company: newCompany };
    });

    // Login the new user
    const userWithMemberships = await this.db.query.users.findFirst({
      where: eq(users.id, result.user.id),
      with: {
        memberships: {
          with: {
            company: true,
          },
        },
      },
    });

    return this.login(userWithMemberships);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.db.query.users.findFirst({
        where: eq(users.id, payload.sub),
        with: {
          memberships: {
            with: {
              company: true,
            },
          },
        },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.id, userId));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}