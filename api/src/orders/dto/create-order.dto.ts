import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsString() productId!: string;
  @IsString() title!: string;
  @IsInt() @Min(1) qty!: number;
  @Type(() => Number) @Min(0) price!: number;
  @IsOptional() @IsString() notes?: string;
}

export class CreateOrderDto {
  @IsString() @IsNotEmpty() customerName!: string;
  @IsEmail() customerEmail!: string;
  @IsOptional() @IsString() customerPhone?: string;

  @IsString() addressLine1!: string;
  @IsOptional() @IsString() addressLine2?: string;
  @IsString() city!: string;
  @IsString() postalCode!: string;
  @IsString() country!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
