// src/order/order.model.ts
import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from 'src/user/user.model';
import { SubscribeModel } from 'src/subscribe/subscribe.model';
import { MovieModel } from 'src/movie/movie.model';

export interface OrderModel extends Base {}

export class OrderModel extends TimeStamps {
	@prop({ required: true })
	orderDate: Date;

	@prop({ required: true })
	sum: number;

	@prop({ ref: () => UserModel, required: true })
	userId: Ref<UserModel>;

	@prop({ ref: () => SubscribeModel })
	subscribeId?: Ref<SubscribeModel>;

	@prop({ ref: () => MovieModel })
	movieId?: Ref<MovieModel>;
}
