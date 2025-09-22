import { Inject, Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { eq, and } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { DATABASE_CONNECTION } from '../database/database.module';
import { users, companies, memberships, invitations } from '../database/schema';
import { LoginRequest, RegisterRequest, RefreshTokenRequest } from '@saas/shared';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
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

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginRequest: LoginRequest) {
    const user = await this.validateUser(loginRequest.email, loginRequest.password);

    // Update last login
    await this.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const payload = { 
      sub: user.id, 
      email: user.email,
      companyId: user.memberships[0]?.companyId || null,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        memberships: user.memberships,
      },
    };
  }

  async register(registerRequest: RegisterRequest) {
    // Check if user already exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, registerRequest.email),
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerRequest.password, 12);

    // Create company slug
    const companySlug = registerRequest.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    // Check company slug uniqueness
    const existingCompany = await this.db.query.companies.findFirst({
      where: eq(companies.slug, companySlug),
    });

    if (existingCompany) {
      throw new ConflictException('Компания с таким названием уже существует');
    }

    // Create user and company in transaction
    return await this.db.transaction(async (tx) => {
      // Create company
      const [company] = await tx
        .insert(companies)
        .values({
          name: registerRequest.companyName,
          slug: companySlug,
        })
        .returning();

      // Create user
      const [user] = await tx
        .insert(users)
        .values({
          email: registerRequest.email,
          passwordHash,
          firstName: registerRequest.firstName,
          lastName: registerRequest.lastName,
          emailVerified: true, // Auto-verify for registration
        })
        .returning();

      // Create membership with OWNER role
      await tx.insert(memberships).values({
        userId: user.id,
        companyId: company.id,
        role: 'OWNER',
      });

      // Return login response
      const payload = {
        sub: user.id,
        email: user.email,
        companyId: company.id,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          memberships: [{
            id: uuidv4(), // This will be the actual ID from DB
            userId: user.id,
            companyId: company.id,
            role: 'OWNER' as const,
            company: {
              id: company.id,
              name: company.name,
              slug: company.slug,
            },
          }],
        },
      };
    });
  }

  async refreshToken(refreshRequest: RefreshTokenRequest) {
    try {
      const payload = this.jwtService.verify(refreshRequest.refreshToken, {
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

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Недействительный refresh token');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        companyId: user.memberships[0]?.companyId || null,
      };

      const accessToken = this.jwtService.sign(newPayload);

      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Недействительный refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        memberships: {
          with: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }
}