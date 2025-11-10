import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { SessionGuard } from '../auth/session.guard';
import type { Request } from 'express';
import { isValidObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // ✅ Lấy thông tin user theo ID
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('ID không hợp lệ');
        }
        return this.usersService.findUserById(id);
    }

    // ✅ Cập nhật thông tin user đang đăng nhập
    @Put(':id')
    @UseGuards(SessionGuard)
    async updateUserById(
        @Param('id') id: string,
        @Body() dto: Partial<User>,
        @Req() req: Request
    ) {
        const { roleId, ...safeDto } = dto;

        const updatedUser = await this.usersService.update(id, safeDto);

        if (req.session.user?.id === id) {
            req.session.user = {
                ...req.session.user,
                username: safeDto.name ?? req.session.user.username, // ✅ dùng name để cập nhật username
                email: req.session.user.email,
                sex: typeof safeDto.sex === 'string' ? safeDto.sex : req.session.user.sex,
                dayOfBirth: typeof safeDto.dayOfBirth === 'string' ? safeDto.dayOfBirth : req.session.user.dayOfBirth,
                lastLogin: req.session.user.lastLogin, 
                roleId: req.session.user.roleId, // giữ nguyên
            };
        }
        
        return updatedUser;
    }
}