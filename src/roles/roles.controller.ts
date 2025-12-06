import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: Partial<Role>, @Req() req: Request) {
    if (!data.rolename) {
      throw new BadRequestException('Role name is required');
    }
    return this.rolesService.createRole(data.rolename);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.rolesService.getAllRoles();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }
}