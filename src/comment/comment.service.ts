import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { CommentModel } from './comment.model';
import { Types } from 'mongoose';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel(CommentModel)
		private readonly commentModel: ModelType<CommentModel>
	) {}

	async setComment(userId: string, dto: CreateCommentDto) {
		const newComment = new this.commentModel({
			userId,
			...dto,
		});

		return newComment.save();
	}

	async updateComment(id: string, userId: string, dto: UpdateCommentDto) {
		const comment = await this.commentModel.findById(id);

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		if (String(comment.userId) !== String(userId)) {
			throw new ForbiddenException('You are not allowed to edit this comment');
		}

		comment.text = dto.text;
		return comment.save();
	}

	async deleteComment(id: string, userId: string) {
		const comment = await this.commentModel.findById(id);

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		if (String(comment.userId) !== String(userId)) {
			throw new ForbiddenException('You are not allowed to delete this comment');
		}

		return comment.remove();
	}

	async getVideoComments(movieId: string) {
		return this.commentModel.find({ movieId: new Types.ObjectId(movieId) }).populate('userId', 'email').exec();
	}
}
