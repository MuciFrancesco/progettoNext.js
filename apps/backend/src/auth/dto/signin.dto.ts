import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;

  @IsString()
  @IsOptional()
  userAgent?: string;
}
