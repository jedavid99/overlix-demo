import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class GenerateActivationCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyActivationCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class CreateActivationCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  expires_at: string;
}

export class UpdateActivationCodeDto {
  @IsString()
  status?: 'pending' | 'used' | 'expired';

  @IsDateString()
  used_at?: string;
}
