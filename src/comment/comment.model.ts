import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from 'src/user/user.model';
import { MovieModel } from 'src/movie/movie.model';

export interface CommentModel extends Base {}

export class CommentModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	userId: Ref<UserModel>;

	@prop({ ref: () => MovieModel })
	movieId: Ref<MovieModel>;

	@prop()
	text: string;
}
