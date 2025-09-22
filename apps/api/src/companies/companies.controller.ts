import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CompaniesService } from './companies.service';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current company' })
  @ApiResponse({ status: 200, description: 'Current company data' })
  async getCurrentCompany(@Request() req: any) {
    return this.companiesService.findById(req.user.company_id);
  }

  @Get('current/members')
  @ApiOperation({ summary: 'Get current company members' })
  @ApiResponse({ status: 200, description: 'Company members list' })
  async getCurrentCompanyMembers(@Request() req: any) {
    return this.companiesService.getMembers(req.user.company_id);
  }
}