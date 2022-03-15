import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from 'src/user/user.model';

export interface SubscribeModel extends Base {}

export class SubscribeModel extends TimeStamps {
	@prop({ required: true })
	name: string;

	@prop({ required: true })
	description: string;

	@prop({ required: true })
	price: number;

	@prop({ required: true })
	duration: number;

	@prop({ ref: () => UserModel, required: false })
	userId?: Ref<UserModel>; // Добавляем поле userId

	@prop({ required: true })
	genres: string[];

	@prop({ required: false })
	actors?: string[];
}
