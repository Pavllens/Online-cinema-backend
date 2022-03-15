import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { MovieModel } from 'src/movie/movie.model';
import { OrderModel } from 'src/order/order.model';

export interface UserModel extends Base {}

@modelOptions({
	schemaOptions: {
		collection: 'User',
	},
})
export class UserModel extends TimeStamps {
	@prop({ unique: true, required: true })
	email: string;

	@prop({ required: true })
	password: string;

	@prop()
	isAdmin?: boolean;

	@prop({ default: [], ref: () => MovieModel })
	favorites?: Ref<MovieModel>[];

	@prop({ default: [], ref: () => OrderModel })
	orders?: Ref<OrderModel>[];
}
