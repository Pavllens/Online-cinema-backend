// src/order/order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { OrderModel } from './order.model';
import { CreateOrderDto } from './dto/order.dto';
import { UserModel } from '../user/user.model';
import { MovieModel } from '../movie/movie.model'
import { SubscribeModel } from '../subscribe/subscribe.model'

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(OrderModel) private readonly orderModel: ModelType<OrderModel>,
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
		@InjectModel(SubscribeModel) private readonly subscribeModel: ModelType<SubscribeModel>,
	) {}

	async createOrder(createOrderDto: CreateOrderDto): Promise<OrderModel> {
		let sum = createOrderDto.sum;

		if (createOrderDto.movieId) {
			const movie = await this.movieModel.findById(createOrderDto.movieId).exec();
			if (!movie) {
				throw new NotFoundException('Movie not found');
			}
			sum = movie.price;
		} else if (createOrderDto.subscribeId) {
			const subscribe = await this.subscribeModel.findById(createOrderDto.subscribeId).exec();
			if (!subscribe) {
				throw new NotFoundException('Subscription not found');
			}
			sum = subscribe.price;
		}

		const createdOrder = new this.orderModel({
			...createOrderDto,
			sum,
			orderDate: new Date(),
		});
		const order = await createdOrder.save();

		// Обновление пользователя, добавление заказа в поле orders
		await this.userModel.findByIdAndUpdate(
			createOrderDto.userId,
			{ $push: { orders: order._id } },
			{ new: true },
		);

		return order;
	}

	async findAll(): Promise<OrderModel[]> {
		return this.orderModel.find().exec();
	}

	async findOne(id: string): Promise<OrderModel> {
		const order = await this.orderModel.findById(id).exec();
		if (!order) {
			throw new NotFoundException('Order not found');
		}
		return order;
	}

	async updateOrder(id: string, updateOrderDto: CreateOrderDto): Promise<OrderModel> {
		const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
		if (!order) {
			throw new NotFoundException('Order not found');
		}
		return order;
	}

	async delete(id: string): Promise<OrderModel> {
		const order = await this.orderModel.findByIdAndDelete(id).exec();
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		// Обновление пользователя, удаление заказа из поля orders
		await this.userModel.findByIdAndUpdate(
			order.userId,
			{ $pull: { orders: order._id } },
			{ new: true }
		);

		return order;
	}
}
