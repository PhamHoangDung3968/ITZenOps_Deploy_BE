import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() data: Partial<Role>, @Request() req) {
        return this.rolesService.createRole(data.rolename as string);
    }
    // @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.rolesService.getAllRoles();
    }
    // @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getRoleById(@Param('id') id: string) {
        return this.rolesService.findById(id);
    }
}
