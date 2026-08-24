import { LanguageCode } from '../constants/language-code.constants';

export class CreateTranslationDto {
  languageCode!: LanguageCode;
  text!: string;
}
