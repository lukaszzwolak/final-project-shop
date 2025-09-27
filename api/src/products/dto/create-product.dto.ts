import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString() @MaxLength(200) title!: string;
  @IsNumber() @Min(0) price!: number;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() imageUrl?: string;
}
