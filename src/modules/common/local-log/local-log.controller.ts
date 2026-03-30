import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import archiver from 'archiver';
import type { Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ActionCode } from '@/modules/helpers/casl/static/action-code';
import { PageCode } from '@/modules/helpers/casl/static/page-code';
import { LocalLogService } from './local-log.service';
import { AuthMethodDecorator, PermissionDecorator } from '@/decorators';
import { getCurrentUtcDateTime } from '@/common/utility/date-fns-utils';
import { ListLocalLogsDto } from './dto/list-local-logs.dto';

@ApiTags('Local Logs')
@Controller('local-log')
// @AuthDecorator()
export class LocalLogController {
  private readonly logsDirectory = path.join(
    import.meta.dirname,
    '..',
    '..',
    '..',
    '..',
    'logs',
  );

  constructor(private readonly localLogService: LocalLogService) {}

  @Post('log/folder/list')
  @AuthMethodDecorator()
  @ApiOperation({
    summary: 'List all folders in the logs directory',
    description: 'Retrieves a list of all folders in the logs directory.',
  })
  @PermissionDecorator({
    action: ActionCode.read,
    subject: PageCode.local_log,
  })
  async getFolders(@Body() data: ListLocalLogsDto, @Res() res: Response) {
    const response = await this.localLogService.getFolders(data);
    res.status(response.statusCode).json(response);
  }

  @Get('log/download/folder/:folderName')
  @AuthMethodDecorator()
  @ApiOperation({
    summary: 'Download a single folder as a zip file',
    description: 'Downloads the specified folder from the logs directory.',
  })
  @PermissionDecorator({
    action: ActionCode.download,
    subject: PageCode.local_log,
  })
  async downloadFolder(
    @Param('folderName') folderName: string,
    @Res() res: Response,
  ) {
    const currentFolderName = folderName;
    if (!currentFolderName || currentFolderName.trim() === '') {
      throw new HttpException(
        'Folder name is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const folderPath = path.join(this.logsDirectory, currentFolderName);

    if (!fs.existsSync(folderPath)) {
      throw new HttpException('Folder not found', HttpStatus.NOT_FOUND);
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${currentFolderName}.zip`,
    );

    // * Uncomment the following lines to enable archiving functionality
    const archive = archiver('zip', { zlib: { level: 9 } }); // Set compression level
    archive.on('error', (err) => {
      throw new HttpException(
        `Error creating archive: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    archive.directory(folderPath, false);
    archive.pipe(res);

    await archive.finalize();
  }

  @Get('log/download/file/*all')
  downloadSingleLogFile(
    @Param('all') relativePath: string[],
    @Res() res: Response,
  ) {
    try {
      if (!relativePath || relativePath.length === 0) {
        throw new NotFoundException('Log file not found');
      }
      const joinedPath = relativePath.join('/');
      const filePath = path.join(this.logsDirectory, joinedPath);

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Log file not found');
      }

      const fileName = `${'logs'}-${getCurrentUtcDateTime()}.json`;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      throw new HttpException(
        'Failed to Download Log File from Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('common-post-req')
  @ApiOperation({
    summary: 'Common POST request handler',
  })
  async dummyPostMethod(
    @Req() _req: Request,
    @Body() data: any,
    @Res() res: Response,
  ) {
    // console.log('req', req?.socket);
    // data = req?.socket;
    const response = await this.localLogService.dummyPostMethod(data);
    res.status(response.statusCode).json(response);
  }
}
