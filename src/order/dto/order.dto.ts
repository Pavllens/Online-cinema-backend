// src/order/dto/order.dto.ts
import { IsString, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
	@IsNumber()
	sum: number;

	@IsString()
	userId: Types.ObjectId;

	@ValidateIf((o) => !o.movieId)
	@IsString()
	@IsOptional()
	subscribeId?: Types.ObjectId;

	@ValidateIf((o) => !o.subscribeId)
	@IsString()
	@IsOptional()
	movieId?: Types.ObjectId;
}
