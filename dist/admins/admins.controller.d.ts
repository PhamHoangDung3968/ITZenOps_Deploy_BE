import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    create(dto: CreateAdminDto): Promise<import("./admins.schema").Admin>;
}
