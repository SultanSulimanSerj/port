import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentCompany } from '../common/decorators/current-company.decorator';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @ApiOperation({ summary: 'Get current company profile' })
  @ApiResponse({ status: 200, description: 'Company profile' })
  @Get('profile')
  async getProfile(@CurrentCompany() companyId: string) {
    return this.companiesService.getCompanyById(companyId);
  }

  @ApiOperation({ summary: 'Update company profile' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @Put('profile')
  async updateProfile(
    @CurrentCompany() companyId: string,
    @Body() updateData: any,
  ) {
    return this.companiesService.updateCompany(companyId, updateData);
  }

  @ApiOperation({ summary: 'Get company members' })
  @ApiResponse({ status: 200, description: 'List of company members' })
  @Get('members')
  async getMembers(@CurrentCompany() companyId: string) {
    return this.companiesService.getCompanyMembers(companyId);
  }
}