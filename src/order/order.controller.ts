import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	@HttpCode(200)
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.orderService.createOrder(createOrderDto);
	}

	@Get()
	findAll() {
		return this.orderService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.orderService.findOne(id);
	}

	@Put(':id')
	@HttpCode(200)
	update(@Param('id') id: string, @Body() updateOrderDto: CreateOrderDto) {
		return this.orderService.updateOrder(id, updateOrderDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.orderService.delete(id);
	}
}
