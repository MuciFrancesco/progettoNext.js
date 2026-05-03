import { IsIn, IsString } from 'class-validator';

export const SUPPORTED_LOCALES = ['it', 'en', 'fr', 'es', 'de'] as const;

export class UpdateLocaleDto {
  @IsString()
  @IsIn(SUPPORTED_LOCALES)
  locale: string;
}
