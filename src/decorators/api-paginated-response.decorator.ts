// TODO: This is a custom decorator to standardize paginated responses in Swagger documentation. It uses the PageDto as a base and allows you to specify the model for the data array. This way, you can easily document endpoints that return paginated results without having to repeat the schema definition for each endpoint.
// import { applyDecorators, type Type } from '@nestjs/common';
// import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
// import { PageDto } from '../common/dto/page.dto';

// export function ApiPaginatedResponse<T extends Type>(options: {
//   model: T;
//   description?: string;
// }): MethodDecorator {
//   return applyDecorators(
//     ApiExtraModels(PageDto, options.model),
//     ApiOkResponse({
//       description: options.description,
//       schema: {
//         allOf: [
//           { $ref: getSchemaPath(PageDto) },
//           {
//             properties: {
//               data: {
//                 type: 'array',
//                 items: { $ref: getSchemaPath(options.model) },
//               },
//             },
//           },
//         ],
//       },
//     }),
//   );
// }

export function ApiPaginatedResponse() {
  //
}
