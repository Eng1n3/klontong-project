import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { IsAtLeastOneFieldPresent } from 'src/common/decorators/least-one-field-present.decorator';

export class UpdateProductDto {
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => {
    return value;
  })
  productCategoryId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  weight: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  width: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  length: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  height: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  price: number;

  @IsFile()
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png', 'image/webp'])
  @MaxFileSize(5 * 1024 * 1024)
  image: MemoryStoredFile;

  @IsAtLeastOneFieldPresent(
    [
      'name',
      'description',
      'weight',
      'width',
      'length',
      'height',
      'price',
      'image',
    ],
    {
      message:
        'At least one of the fields (name or description) must be provided',
    },
  )
  checkFields: boolean;
}
