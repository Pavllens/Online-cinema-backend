// src/subscribe/dto/create-custom-subscribe.dto.ts
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCustomSubscribeDto {
	@IsArray()
	genres: Types.ObjectId[];

	@IsArray()
	@IsOptional()
	actors?: Types.ObjectId[];
}
