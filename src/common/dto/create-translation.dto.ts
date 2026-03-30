import { EnumField, StringField } from '../../decorators/field.decorators';
import { LanguageCode } from '../constants/language-code';

export class CreateTranslationDto {
  @EnumField(() => LanguageCode)
  languageCode!: LanguageCode;

  @StringField()
  text!: string;
}
