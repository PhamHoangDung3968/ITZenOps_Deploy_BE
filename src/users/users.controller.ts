import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';


@Controller('users')
export class UsersController {
    // constructor(private readonly usersService: UsersService) {}
    // @Post()
    // create(@Body() data: Partial<User>) {
    //     return this.usersService.createUser(data.name as string, data.email as string, data.age);
    // }
    // @Get()
    // findAll() {
    //     return this.usersService.getAllUsers();
    // }


}
