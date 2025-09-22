import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ObjectsService } from './objects.service';
import { 
  CreateObjectDto, 
  UpdateObjectDto, 
  AddObjectMemberDto, 
  UpdateObjectMemberDto 
} from '@saas-portal/shared';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
  constructor(private objectsService: ObjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all objects' })
  async findAll(@Query('companyId') companyId: string) {
    return this.objectsService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get object by ID' })
  async findOne(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.objectsService.findById(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new object' })
  async create(@Body() createObjectDto: CreateObjectDto, @Query('companyId') companyId: string) {
    return this.objectsService.create(createObjectDto, companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update object' })
  async update(
    @Param('id') id: string,
    @Body() updateObjectDto: UpdateObjectDto,
    @Query('companyId') companyId: string
  ) {
    return this.objectsService.update(id, updateObjectDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete object' })
  async remove(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.objectsService.delete(id, companyId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get object members' })
  async getMembers(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.objectsService.getMembers(id, companyId);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to object' })
  async addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddObjectMemberDto,
    @Query('companyId') companyId: string
  ) {
    return this.objectsService.addMember(id, addMemberDto, companyId);
  }

  @Put(':id/members/:userId')
  @ApiOperation({ summary: 'Update object member' })
  async updateMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateMemberDto: UpdateObjectMemberDto,
    @Query('companyId') companyId: string
  ) {
    return this.objectsService.updateMember(id, userId, updateMemberDto, companyId);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member from object' })
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Query('companyId') companyId: string
  ) {
    return this.objectsService.removeMember(id, userId, companyId);
  }
}