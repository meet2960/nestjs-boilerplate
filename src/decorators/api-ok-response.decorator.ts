import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseDto } from '@/common/dto/api-response.dto';

export function CustomApiOkResponse<T extends Type<any>>(options: {
  model: T;
  description?: string;
  isArray?: boolean;
}): MethodDecorator {
  const { model, description, isArray = false } = options;
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            type: 'object',
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized Request',
      schema: {
        type: 'object',
        properties: {
          data: { nullable: true, default: null },
          message: {
            type: 'string',
            default: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            default: 401,
          },
          status: {
            type: 'string',
            default: 'UNAUTHORIZED',
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        properties: {
          data: { nullable: true, default: null },
          message: {
            type: 'string',
            default: 'Internal Server Error',
          },
          statusCode: {
            type: 'number',
            default: 500,
          },
          status: {
            type: 'string',
            default: 'INTERNAL_SERVER_ERROR',
          },
        },
      },
    }),
  );
}
