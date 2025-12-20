import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updates: Partial<User>
  ) {
    return this.usersService.updateUser(id, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/role')
  async updateUserRole(@Param('id') id: string, @Body('roleId') roleId: string) {
    return this.usersService.updateUserRole(id, roleId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/sex')
  async updateSex(@Param('id') id: string, @Body('sex') sex: string) {
    return this.usersService.updateSex(id, sex);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: number
  ) {
    return this.usersService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Post('manual')
  async createManualUser(@Body() data: Partial<User>) {
    try {
      return await this.usersService.createManualUser(data);
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException('Email này đã tồn tại trong hệ thống. Vui lòng nhập email khác!');
      }
      throw new BadRequestException('Không thể tạo người dùng. Vui lòng kiểm tra lại dữ liệu!');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }







}