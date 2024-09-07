import { IsOptional } from 'class-validator';
import { IsAtLeastOneFieldPresent } from 'src/common/decorators/least-one-field-present.decorator';

export class UpdateProductCategoryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsAtLeastOneFieldPresent(['name', 'description'], {
    message: 'At least one of the fields (name or description) must be provided',
  })
  checkFields: boolean;
}
