import { Body, Controller, Post } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}
    @Post('create')
    async create(@Body() dto: CreateAdminDto) {
        return this.adminsService.createAdmin(dto.username, dto.password);
    }

}
