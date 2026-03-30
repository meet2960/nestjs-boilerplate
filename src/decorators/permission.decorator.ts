import { IAbility } from '@/modules/helpers/casl/static/casl.types';
import { SetMetadata } from '@nestjs/common';

export const ABILITY = 'ABILITY';

export const PermissionDecorator = (...requiredAbility: IAbility[]) =>
  SetMetadata(ABILITY, requiredAbility);
