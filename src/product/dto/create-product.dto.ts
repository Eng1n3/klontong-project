import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateProductDto {
  @IsNotEmpty()
  @IsUUID()
  @Transform(({ value }) => {
    return value;
  })
  productCategoryId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  width: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  length: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  height: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return +value;
  })
  price: number;

  @IsFile()
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png', 'image/webp'])
  @MaxFileSize(5 * 1024 * 1024)
  image: MemoryStoredFile;
}
