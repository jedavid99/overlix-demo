import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ActivationCodesService } from '../services/activation-codes.service';
import { 
  GenerateActivationCodeDto, 
  CreateActivationCodeDto, 
  UpdateActivationCodeDto 
} from '../dto/activation-code.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermission } from '../../../common/decorators/require-permission.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth/admin')
export class ActivationCodesController {
  constructor(private readonly activationCodesService: ActivationCodesService) {}

  @Public()
  @Post('generate-codes')
  @HttpCode(HttpStatus.CREATED)
  async generateCode(@Body() generateDto: GenerateActivationCodeDto) {
    return this.activationCodesService.generateCode(generateDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('usuarios', 'crear')
  @Get('activation-codes')
  async getAllCodes() {
    return this.activationCodesService.getAllCodes();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('usuarios', 'crear')
  @Post('activation-codes')
  @HttpCode(HttpStatus.CREATED)
  async createCode(@Body() createDto: CreateActivationCodeDto) {
    return this.activationCodesService.generateCode(createDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('usuarios', 'leer')
  @Get('activation-codes/:id')
  async getCodeById(@Param('id') id: string) {
    return this.activationCodesService.getCodeById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('usuarios', 'actualizar')
  @Put('activation-codes/:id')
  async updateCode(@Param('id') id: string, @Body() updateDto: UpdateActivationCodeDto) {
    return this.activationCodesService.updateCode(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('usuarios', 'eliminar')
  @Delete('activation-codes/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCode(@Param('id') id: string) {
    return this.activationCodesService.deleteCode(id);
  }
}
