import { ActionCode } from '@/modules/helpers/casl/static/action-code';
import { PageCode } from '@/modules/helpers/casl/static/page-code';
import type {
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
} from '@nestjs/swagger';
// import { ApplicationSharedData } from '@/config/shared-data/application-shared-data';

// const prefixPath = ApplicationSharedData.appApiPrefix + '/';

interface IRoutePath {
  i18pageCode: string;
  controllerName: string;
  swaggerApiTag: string;
  list: {
    path: string;
    pageCode: string;
    actionCode: string;
    apiOperationOptions: ApiOperationOptions;
    apiParamsOptions: ApiParamOptions[];
    apiQueryOptions: ApiQueryOptions[];
    successMsg: string;
    errorMsg: string;
  };
}

export const usersController: IRoutePath = {
  i18pageCode: '',
  controllerName: 'users',
  swaggerApiTag: 'Users',
  list: {
    path: 'list',
    pageCode: PageCode.users,
    actionCode: ActionCode.list,
    apiOperationOptions: {
      tags: ['Users'],
      summary: 'List Users',
      description:
        'Retrieve a list of users with pagination and filtering options.',
    },
    apiParamsOptions: [],
    apiQueryOptions: [],
    successMsg: 'success_msg',
    errorMsg: 'error_msg',
  },
};
