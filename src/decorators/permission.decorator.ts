import { SetMetadata } from '@nestjs/common';

export const ABILITY = 'ABILITY';

export interface IAbility {
  action: string;
  subject: string;
}

// export interface IAbility {
//   action: Action;
//   subject: Subjects;
// }

export const PermissionDecorator = (...requiredAbility: IAbility[]) =>
  SetMetadata(ABILITY, requiredAbility);
