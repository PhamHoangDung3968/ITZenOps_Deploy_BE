// import { Module } from '@nestjs/common';
// import { AdminsController } from './admins.controller';
// import { AdminsService } from './admins.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Admin, AdminSchema } from './admins.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{name: Admin.name, schema: AdminSchema}])
//   ],
//   controllers: [AdminsController],
//   providers: [AdminsService]
// })
// export class AdminsModule {}


// admins.module.ts
import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admins.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService] // 👈 thêm dòng này để AuthModule dùng được
})
export class AdminsModule {}