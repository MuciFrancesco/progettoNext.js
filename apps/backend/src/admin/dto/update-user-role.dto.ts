import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserRoleDto {
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isEmployee?: boolean;

  @IsBoolean()
  @IsOptional()
  canCreateCart?: boolean;

  @IsBoolean()
  @IsOptional()
  canOrderProducts?: boolean;
}
