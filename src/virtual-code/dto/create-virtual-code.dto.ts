import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVirtualCodeDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string}) => {
    return value.toLowerCase();
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}
