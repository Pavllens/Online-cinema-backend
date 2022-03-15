// src/subscribe/dto/subscribe.dto.ts
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSubscribeDto {
	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber()
	price: number;

	@IsNumber()
	duration: number;

	@IsArray()
	@IsOptional()
	genres?: Types.ObjectId[];

	@IsArray()
	@IsOptional()
	actors?: Types.ObjectId[];
}

export class UpdateSubscribeDto extends PartialType(CreateSubscribeDto) {}
