import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderModel } from './order.model';
import { UserModel } from '../user/user.model';
import { MovieModel } from '../movie/movie.model';
import { SubscribeModel } from '../subscribe/subscribe.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: OrderModel,
				schemaOptions: {
					collection: 'Order',
				},
			},
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
			{
				typegooseClass: MovieModel,
				schemaOptions: {
					collection: 'Movie',
				},
			},
			{
				typegooseClass: SubscribeModel,
				schemaOptions: {
					collection: 'Subscribe',
				},
			},
		]),
	],
	providers: [OrderService],
	controllers: [OrderController],
	exports: [OrderService],
})
export class OrderModule {}
