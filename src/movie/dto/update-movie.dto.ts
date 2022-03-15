// src/movie/dto/update-movie.dto.ts
import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class Parameters {
	@IsNumber()
	year: number;

	@IsNumber()
	duration: number;

	@IsString()
	country: string;
}

export class UpdateMovieDto {
	@IsString()
	poster: string;

	@IsString()
	bigPoster: string;

	@IsString()
	title: string;

	@IsString()
	slug: string;

	@IsObject()
	parameters?: Parameters;

	@IsString()
	videoUrl: string;

	@IsArray()
	@IsString({ each: true })
	genres: string[];

	@IsArray()
	@IsString({ each: true })
	actors: string[];

	@IsNumber()
	price: number; // Добавляем поле price

	@IsBoolean()
	needSubscribe?: boolean; // Добавляем поле needSubscribe

	isSendTelegram?: boolean;
}
