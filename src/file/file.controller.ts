import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
	Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		console.log('Received file:', file);  // Логирование файла
		return this.fileService.saveFiles([file], folder);
	}

	@Post('link')
	@HttpCode(200)
	@Auth('admin')
	async uploadLink(
		@Body('link') link: string,
		@Query('folder') folder?: string
	) {
		console.log('Received link:', link);  // Логирование ссылки
		return this.fileService.saveLink(link, folder);
	}
}
