import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Delete,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { Types } from 'mongoose';

@Controller('comments')
@Auth()
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@UsePipes(new ValidationPipe())
	@Post('set-comment')
	@HttpCode(200)
	async setComment(
		@User('_id') userId: string,
		@Body() dto: CreateCommentDto
	) {
		return this.commentService.setComment(userId, dto);
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	async updateComment(
		@Param('id') id: string,
		@User('_id') userId: string,
		@Body() dto: UpdateCommentDto
	) {
		return this.commentService.updateComment(id, userId, dto);
	}

	@Delete(':id')
	@HttpCode(200)
	async deleteComment(
		@Param('id') id: string,
		@User('_id') userId: string,
	) {
		return this.commentService.deleteComment(id, userId);
	}

	@Get(':movieId')
	async getComments(@Param('movieId') movieId: Types.ObjectId) {
		return this.commentService.getVideoComments(String(movieId));
	}
}
