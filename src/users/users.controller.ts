import { BadRequestException, Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: Partial<User>) {
    if (!data || !data.email) {
      throw new BadRequestException('Email is required');
    }

    const roleId = data.roleId ? new Types.ObjectId(data.roleId as any) : undefined;

    return this.usersService.createUser(data.name ?? '', data.email, roleId);
  }

  @Get()
  findAll() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() body: Partial<User>) {
    const userId = (req.user as any).userId;
    return this.usersService.updateProfile(userId, body);
  }
}