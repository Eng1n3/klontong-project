import { IsNumber, IsOptional } from 'class-validator';
import { IsAtLeastOneFieldPresent } from 'src/common/decorators/least-one-field-present.decorator';

export class UpdateVirtualCodeDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber()
  code?: number;

  @IsAtLeastOneFieldPresent(['name', 'code'], {
    message: 'At least one of the fields (name or code) must be provided',
  })
  checkFields: boolean;
}
