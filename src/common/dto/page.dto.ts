import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { PageMetaDto } from "./page-meta.dto";

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  @ApiProperty()
  readonly message: string;

  constructor(data: T[], meta: PageMetaDto, message: string) {
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}