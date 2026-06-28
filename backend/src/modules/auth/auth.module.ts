import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { ActivationCodesService } from './services/activation-codes.service';
import { AuthController } from './controllers/auth.controller';
import { ActivationCodesController } from './controllers/activation-codes.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  controllers: [AuthController, ActivationCodesController],
  providers: [AuthService, ActivationCodesService, JwtStrategy],
  exports: [AuthService, ActivationCodesService],
})
export class AuthModule {}
