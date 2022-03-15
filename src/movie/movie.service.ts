import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieModel } from './movie.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { UserModel } from 'src/user/user.model';
import { OrderModel } from 'src/order/order.model';
import { SubscribeModel } from 'src/subscribe/subscribe.model';

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		@InjectModel(OrderModel) private readonly orderModel: ModelType<OrderModel>,
		@InjectModel(SubscribeModel) private readonly subscribeModel: ModelType<SubscribeModel>
	) {}

	async checkAccess(userId: string, movieId: string): Promise<boolean> {
		const user = await this.userModel.findById(userId)
			.populate({
				path: 'orders',
				populate: [
					{ path: 'movieId', model: this.movieModel.modelName },
					{ path: 'subscribeId', model: this.subscribeModel.modelName },
				],
			})
			.exec();

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const orders = user.orders as (OrderModel & {
			movieId: MovieModel;
			subscribeId: SubscribeModel;
		})[];

		if (!orders) {
			return false;
		}

		const hasPurchasedMovie = orders.some(
			(order) => order.movieId && String(order.movieId._id) === movieId
		);

		if (hasPurchasedMovie) {
			return true;
		}

		const activeSubscription = orders.find(
			(order) =>
				order.subscribeId &&
				new Date(order.orderDate).getTime() +
				order.subscribeId.duration * 30 * 24 * 60 * 60 * 1000 >
				Date.now()
		);

		if (!activeSubscription) {
			return false;
		}

		const movie = await this.movieModel.findById(movieId).exec();

		if (!movie) {
			throw new NotFoundException('Movie not found');
		}

		const hasAccessToMovie = movie.genres.some((genre) =>
			activeSubscription.subscribeId.genres.some(
				(subGenreId) => String(subGenreId) === String(genre._id)
			)
		);

		return hasAccessToMovie;
	}


	async getAll(searchTerm?: string) {
		let options = {};

		if (searchTerm)
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			};

		return this.movieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('actors genres')
			.exec();
	}

	async bySlug(slug: string) {
		const doc = await this.movieModel.findOne({ slug })
			.populate('actors genres')
			.exec();
		if (!doc) throw new NotFoundException('Movie not found');
		return doc;
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = await this.movieModel.find({ actors: actorId }).exec();
		if (!docs) throw new NotFoundException('Movies not found');
		return docs;
	}

	async byGenres(genreIds: Types.ObjectId[]) {
		const docs = await this.movieModel.find({
			genres: { $in: genreIds },
		}).exec();
		if (!docs) throw new NotFoundException('Movies not found');
		return docs;
	}

	async getMostPopular() {
		return this.movieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec();
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.movieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 },
			},
			{
				new: true,
			}
		).exec();
		if (!updateDoc) throw new NotFoundException('Movie not found');
		return updateDoc;
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.movieModel.findByIdAndUpdate(
			id,
			{
				rating: newRating,
			},
			{
				new: true,
			}
		).exec();
	}

	/* Admin place */
	async byId(_id: string) {
		const doc = await this.movieModel.findById(_id);
		if (!doc) throw new NotFoundException('Movie not found');

		return doc;
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
			price: 0,  // Добавлено поле price
			needSubscribe: false,  // Добавлено поле needSubscribe
		};
		const movie = await this.movieModel.create(defaultValue);
		return movie._id;
	}

	async update(_id: string, dto: UpdateMovieDto) {
		const updateDoc = await this.movieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec();
		if (!updateDoc) throw new NotFoundException('Movie not found');

		return updateDoc;
	}

	async delete(id: string) {
		const deleteDoc = this.movieModel.findByIdAndDelete(id).exec();
		if (!deleteDoc) throw new NotFoundException('Movie not found');

		return deleteDoc;
	}
}
