import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { SubscribeModel } from './subscribe.model';
import { OrderModel } from '../order/order.model';
import { UserModel } from '../user/user.model';
import { CreateSubscribeDto, UpdateSubscribeDto } from './dto/subscribe.dto';
import { CreateCustomSubscribeDto } from './dto/create-custom-subscribe.dto';

@Injectable()
export class SubscribeService {
	constructor(
		@InjectModel(SubscribeModel) private readonly subscribeModel: ModelType<SubscribeModel>,
		@InjectModel(OrderModel) private readonly orderModel: ModelType<OrderModel>,
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) {}

	async createSubscribe(createSubscribeDto: CreateSubscribeDto): Promise<SubscribeModel> {
		const createdSubscribe = new this.subscribeModel(createSubscribeDto);
		return createdSubscribe.save();
	}

	async findAllSubscribes(userId: string): Promise<SubscribeModel[]> {
		return this.subscribeModel.find({
			$or: [
				{ userId: userId }, // Подписки созданные пользователем
				{ userId: { $exists: false } } // Общие подписки
			]
		}).exec();
	}

	async findSubscribeById(id: string): Promise<SubscribeModel> {
		const subscribe = await this.subscribeModel.findById(id).exec();
		if (!subscribe) {
			throw new NotFoundException('Subscribe not found');
		}
		return subscribe;
	}

	async updateSubscribe(id: string, updateSubscribeDto: UpdateSubscribeDto): Promise<SubscribeModel> {
		const subscribe = await this.subscribeModel.findByIdAndUpdate(id, updateSubscribeDto, { new: true }).exec();
		if (!subscribe) {
			throw new NotFoundException('Subscribe not found');
		}
		return subscribe;
	}

	async deleteSubscribe(id: string): Promise<SubscribeModel> {
		const subscribe = await this.subscribeModel.findByIdAndDelete(id).exec();
		if (!subscribe) {
			throw new NotFoundException('Subscribe not found');
		}
		return subscribe;
	}

	async buySubscribe(userId: string, subscribeId: string): Promise<OrderModel> {
		const subscribe = await this.subscribeModel.findById(subscribeId).exec();
		if (!subscribe) {
			throw new NotFoundException('Subscribe not found');
		}
		const order = new this.orderModel({ sum: subscribe.price, userId, subscribeId, orderDate: new Date() });
		await order.save();

		await this.userModel.findByIdAndUpdate(userId, { $push: { orders: order._id } }).exec();

		return order;
	}

	async createCustomSubscribe(userId: string, dto: CreateCustomSubscribeDto): Promise<OrderModel> {
		const pricePerGenre = 5;
		const pricePerActor = 2;

		const totalGenres = dto.genres.length;
		const totalActors = dto.actors?.length || 0;

		const totalPrice = totalGenres * pricePerGenre + totalActors * pricePerActor;

		const customSubscribe = new this.subscribeModel({
			name: `Custom Subscription for User ${userId} at ${Date.now()}`,
			description: 'Custom user subscription',
			price: totalPrice,
			duration: 30,
			genres: dto.genres,
			actors: dto.actors,
			userId // Добавляем userId
		});

		try {
			const subscribe = await customSubscribe.save();
			const order = new this.orderModel({ sum: totalPrice, userId, subscribeId: subscribe._id, orderDate: new Date() });
			await order.save();

			await this.userModel.findByIdAndUpdate(userId, { $push: { orders: order._id } }).exec();

			return order;
		} catch (error) {
			console.error('Error creating custom subscription:', error);
			throw new InternalServerErrorException('Failed to create custom subscription');
		}
	}

	async checkSubscription(userId: string): Promise<boolean> {
		const order = await this.orderModel.findOne({ userId, subscribeId: { $exists: true } }).exec();
		return !!order;
	}
}
