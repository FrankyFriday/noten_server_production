import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateReleaseDto {
  @IsString()
  @IsNotEmpty()
  version!: string;

  @IsBoolean()
  mandatory!: boolean;

  @IsString()
  @IsNotEmpty()
  notes!: string;

  @IsUrl()
  url!: string;

  @IsDateString()
  publishedAt!: string;

  @IsOptional()
  @IsString()
  author?: string;
}
