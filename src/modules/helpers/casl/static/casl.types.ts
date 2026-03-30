import type { MongoAbility, MongoQuery } from '@casl/ability';
import { PageCodeKey } from './page-code';

// * Ability generated from Permission Guard
export interface IPagePermissions {
  page_code: string;
  action_list: string[];
}

// * Action ENUM
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  List = 'list',
  View = 'view',
  All = 'all',
}

// * Subjects from the PageCodes Class
export type Subjects = PageCodeKey | PageCodeKey[];

// * Types Based on New Mongo Ability
type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;
export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

export interface IAbility {
  action: string;
  subject: string;
}
