import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, InternalServerErrorException } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto, UpdateSubscribeDto } from './dto/subscribe.dto';
import { CreateCustomSubscribeDto } from './dto/create-custom-subscribe.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../user/decorators/user.decorator';

@Controller('subscribes')
export class SubscribeController {
	constructor(private readonly subscribeService: SubscribeService) {}

	@Get()
	@Auth()
	findAll(@User('_id') userId: string) {
		return this.subscribeService.findAllSubscribes(userId);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.subscribeService.findSubscribeById(id);
	}

	@Post()
	@Auth('admin')
	@HttpCode(200)
	create(@Body() createSubscribeDto: CreateSubscribeDto) {
		return this.subscribeService.createSubscribe(createSubscribeDto);
	}

	@Put(':id')
	@Auth('admin')
	@HttpCode(200)
	update(@Param('id') id: string, @Body() updateSubscribeDto: UpdateSubscribeDto) {
		return this.subscribeService.updateSubscribe(id, updateSubscribeDto);
	}

	@Delete(':id')
	@Auth('admin')
	remove(@Param('id') id: string) {
		return this.subscribeService.deleteSubscribe(id);
	}

	@Post('buy/:subscribeId')
	@Auth()
	@HttpCode(200)
	buy(@Param('subscribeId') subscribeId: string, @User('_id') userId: string) {
		return this.subscribeService.buySubscribe(userId, subscribeId);
	}

	@Post('custom')
	@Auth()
	@HttpCode(200)
	async createCustom(@Body() createCustomSubscribeDto: CreateCustomSubscribeDto, @User('_id') userId: string) {
		try {
			return await this.subscribeService.createCustomSubscribe(userId, createCustomSubscribeDto);
		} catch (error) {
			console.error('Error creating custom subscription:', error);
			throw new InternalServerErrorException('Failed to create custom subscription');
		}
	}

	@Get('check/:userId')
	@Auth()
	checkSubscription(@Param('userId') userId: string) {
		return this.subscribeService.checkSubscription(userId);
	}
}
