import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
	@IsString()
	@IsNotEmpty()
	text: string;

	@IsMongoId()
	movieId: Types.ObjectId;
}

export class UpdateCommentDto {
	@IsString()
	@IsNotEmpty()
	text: string;
}
