import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBasketStatusDto {
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
