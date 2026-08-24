import { Injectable } from '@nestjs/common';
import { flatMap } from 'lodash-es';
import { ActionCode } from '@/common/constants/action-code.constants';
import { PageCode } from '@/common/constants/page-code.constants';
import { Actions, AppAbility, Subjects } from '@/common/types/casl.interface';
import { IPagePermissions } from '@/common/types/jwt-payload.interface';
import type { IUserSession } from '@/common/types/user-session.interface';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { ExtractSubjectType } from '@casl/ability';

@Injectable()
export class CaslAbilityFactory {
  createForUser(
    permissions: IPagePermissions[],
    user: IUserSession,
  ): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    if (user.role_code === 'SUPER_ADMIN') {
      can(ActionCode.manage, PageCode.all);
    } else {
      const transformedPermission = flatMap(
        permissions,
        ({ action_list, page_code }) =>
          action_list.map((action) => ({
            name: page_code.toLocaleLowerCase() as Subjects,
            value: action.toLocaleLowerCase() as Actions,
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

  buildPermissionForAdminUsers(): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    can(ActionCode.manage, PageCode.all);
    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
