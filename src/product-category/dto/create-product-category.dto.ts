import { Transform } from 'class-transformer';
import { isLowercase, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string}) => {
    return value.toLowerCase();
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
