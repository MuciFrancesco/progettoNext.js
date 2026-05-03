import { IsNotEmpty, IsString, Length } from 'class-validator';

export class OAuthExchangeDto {
  @IsString()
  @IsNotEmpty()
  @Length(64, 64)
  code!: string;
}
