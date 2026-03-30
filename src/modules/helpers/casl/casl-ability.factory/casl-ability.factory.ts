import { Injectable } from '@nestjs/common';
import { flatMap } from 'lodash-es';
import type { IUserSession } from '@/common/entity/IUserSession';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { ExtractSubjectType } from '@casl/ability';
import {
  Action,
  type AppAbility,
  type IPagePermissions,
  type Subjects,
} from '../static/casl.types';
import { PageCode } from '../static/page-code';

@Injectable()
export class CaslAbilityFactory {
  createForUser(
    permissions: IPagePermissions[],
    user: IUserSession,
  ): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    if (user.role_code === 'SUPER_ADMIN') {
      can(Action.Manage, PageCode.all);
    } else {
      const transformedPermission = flatMap(
        permissions,
        ({ action_list, page_code }) =>
          action_list.map((action) => ({
            name: page_code.toLocaleLowerCase() as Subjects,
            value: action.toLocaleLowerCase() as Action,
          })),
      );
      transformedPermission.forEach((item, _index) =>
        can(item.value, item.name),
      );
    }

    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
