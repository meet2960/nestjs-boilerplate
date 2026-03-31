import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ResponseTypeService } from '@/modules/helpers/response-type/response-type.service';

@Injectable()
export class LocalLogService {
  constructor(
    private readonly responseType: ResponseTypeService,
    // private readonly emailService: EmailSenderService,
  ) {}
  private readonly logsDirectory = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'logs',
  );

  // TODO : Fix the Payload type with respect to zod dto
  async getFolders(payload: any) {
    const allFolders = fs
      .readdirSync(this.logsDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .sort((a, b) => b.localeCompare(a));

    const total = allFolders.length;
    const page = payload.currentPage ?? 1;
    const limit = payload.rowPerPage ?? 10;
    const start = (page - 1) * limit;
    const paginatedFolders = allFolders.slice(start, start + limit);

    const logsData = paginatedFolders.map((dateFolder) => {
      const dateFolderPath = path.join(this.logsDirectory, dateFolder);

      const subFolders = fs
        .readdirSync(dateFolderPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((subDir) => {
          const subFolderPath = path.join(dateFolderPath, subDir.name);
          const files = fs.existsSync(subFolderPath)
            ? fs
                .readdirSync(subFolderPath)
                .filter((file) => file.endsWith('.log'))
            : [];

          return {
            name: subDir.name,
            files,
          };
        });

      return {
        dateFolder,
        subFolders,
      };
    });

    const res = {
      data: logsData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return this.responseType.successResponse({
      data: res,
      message: 'Logs Retrieved Successfully',
    });
  }

  async dummyPostMethod(data: any) {
    try {
      return this.responseType.successResponse({
        data: { payloadForRequest: data },
        message: 'Dummy Post Method Run Successfully',
      });
    } catch (error) {
      return this.responseType.errorResponse({
        data: null,
        message: 'Error in Dummy Post Method',
        error,
      });
    }
  }
}
