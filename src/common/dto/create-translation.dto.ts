import { LanguageCode } from '../constants/language-code';

export class CreateTranslationDto {
  languageCode!: LanguageCode;
  text!: string;
}
