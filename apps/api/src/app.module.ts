import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ObjectsModule } from './objects/objects.module';
import { DocumentsModule } from './documents/documents.module';
import { TasksModule } from './tasks/tasks.module';
import { FinanceModule } from './finance/finance.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ChatModule } from './chat/chat.module';
import { TemplatesModule } from './templates/templates.module';
import { NumberingModule } from './numbering/numbering.module';
import { UploadsModule } from './uploads/uploads.module';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),

    // Database
    DatabaseModule,

    // Feature modules
    AuthModule,
    CompaniesModule,
    ObjectsModule,
    DocumentsModule,
    TasksModule,
    FinanceModule,
    ApprovalsModule,
    ChatModule,
    TemplatesModule,
    NumberingModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}