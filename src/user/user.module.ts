import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ConfigModule } from '@nestjs/config';
import { OrderModel } from '../order/order.model';
import { MovieModule } from '../movie/movie.module';

@Module({
	controllers: [UserController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
			{
				typegooseClass: OrderModel,
				schemaOptions: {
					collection: 'Order',
				},
			},
		]),
		ConfigModule,
		MovieModule,
	],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
