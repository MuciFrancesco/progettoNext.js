import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class BulkDeleteProductDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  ids!: string[];
}
