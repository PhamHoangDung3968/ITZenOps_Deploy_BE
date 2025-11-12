import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { SessionGuard } from 'src/auth/session.guard';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    // @Post()
    // create(@Body() data: Partial<User>) {
    //     return this.usersService.createUser(data.name as string, data.email as string, data.age);
    // }
    // @Get()
    // findAll() {
    //     return this.usersService.getAllUsers();
    // }
    @Put('profile')
    @UseGuards(SessionGuard)
    async updateProfile(@Req() req: any, @Body() body: Partial<User>) {
        const userId = req.user._id;
        return this.usersService.updateProfile(userId, body);
    }


}
