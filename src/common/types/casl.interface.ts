import type { MongoAbility, MongoQuery } from '@casl/ability';
import { ActionCodeKey } from '../constants/action-code.constants';
import { PageCodeKey } from '../constants/page-code.constants';

// * Subjects from the PageCodes Class
export type Subjects = PageCodeKey;
export type Actions = ActionCodeKey;

// * Types Based on New Mongo Ability
type PossibleAbilities = [Actions, Subjects];
type Conditions = MongoQuery;
export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

export interface IAbility {
  action: Actions;
  subject: Subjects;
}
