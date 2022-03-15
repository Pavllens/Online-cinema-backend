// src/subscribe/subscribe.module.ts
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { SubscribeModel } from './subscribe.model';
import { OrderModel } from '../order/order.model';
import { UserModel } from '../user/user.model'

@Module({
	imports: [
		TypegooseModule.forFeature([SubscribeModel]),
		TypegooseModule.forFeature([OrderModel]),
		TypegooseModule.forFeature([UserModel])
	],
	providers: [SubscribeService],
	controllers: [SubscribeController],
	exports: [SubscribeService],
})
export class SubscribeModule {}
