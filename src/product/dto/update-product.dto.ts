import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
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
  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  productCategoryId?: string;

  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  @IsString()
  name?: string;

  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  @IsString()
  description?: string;

  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  @IsNumber()
  weight?: number;

  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  @IsNumber()
  width?: number;

  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  @IsNumber()
  length?: number;

  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  @IsNumber()
  height?: number;

  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  @IsNumber()
  price?: number;

  @IsFile()
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png', 'image/webp'])
  @MaxFileSize(5 * 1024 * 1024)
  @ValidateIf(({ value }) => {
    return value ? true : false;
  })
  image?: MemoryStoredFile;

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
      message: `At least one of the fields (${[
        'name',
        'description',
        'weight',
        'width',
        'length',
        'height',
        'price',
        'image',
      ].join(', ')}) must be provided`,
    },
  )
  checkFields: boolean;
}
