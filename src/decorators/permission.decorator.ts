import { SetMetadata } from '@nestjs/common';
import { IAbility } from '@/common/types/casl.interface';

export const ABILITY = 'ABILITY';

export const PermissionDecorator = (...requiredAbility: IAbility[]) =>
  SetMetadata(ABILITY, requiredAbility);
