import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TelegramModule } from 'src/telegram/telegram.module';
import { MovieController } from './movie.controller';
import { MovieModel } from './movie.model';
import { MovieService } from './movie.service';
import { OrderModel } from '../order/order.model'; // Добавьте этот импорт
import { SubscribeModel } from '../subscribe/subscribe.model'; // Добавьте этот импорт
import { UserModel } from '../user/user.model'; // Добавьте этот импорт

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MovieModel,
				schemaOptions: {
					collection: 'Movie',
				},
			},
			{
				typegooseClass: OrderModel,
				schemaOptions: {
					collection: 'Order',
				},
			},
			{
				typegooseClass: SubscribeModel,
				schemaOptions: {
					collection: 'Subscribe',
				},
			},
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		TelegramModule,
	],
	controllers: [MovieController],
	providers: [MovieService],
	exports: [MovieService],
})
export class MovieModule {}
