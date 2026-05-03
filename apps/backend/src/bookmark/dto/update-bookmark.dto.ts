import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBookmarkDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value.trim())
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsOptional()
  link?: string;
}
