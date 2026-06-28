import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { 
  GenerateActivationCodeDto, 
  CreateActivationCodeDto, 
  UpdateActivationCodeDto 
} from '../dto/activation-code.dto';

@Injectable()
export class ActivationCodesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async generateCode(generateDto: GenerateActivationCodeDto) {
    // Generate a random 6-character code
    const code = this.generateRandomCode();
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const query = `
      INSERT INTO activation_codes (code, email, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, code, email, status, expires_at, created_at
    `;

    const result = await this.databaseService.query(query, [
      code,
      generateDto.email,
      expiresAt.toISOString(),
    ]);

    return result[0];
  }

  async verifyCode(code: string) {
    const query = `
      SELECT * FROM activation_codes
      WHERE code = $1 AND status = 'pending' AND expires_at > NOW()
    `;

    const result = await this.databaseService.query(query, [code]);

    if (!result || result.length === 0) {
      throw new BadRequestException('Invalid or expired activation code');
    }

    return result[0];
  }

  async useCode(code: string) {
    const query = `
      UPDATE activation_codes
      SET status = 'used', used_at = NOW()
      WHERE code = $1 AND status = 'pending'
      RETURNING *
    `;

    const result = await this.databaseService.query(query, [code]);

    if (!result || result.length === 0) {
      throw new BadRequestException('Invalid or already used activation code');
    }

    return result[0];
  }

  async getAllCodes() {
    const query = `
      SELECT * FROM activation_codes
      ORDER BY created_at DESC
    `;

    return await this.databaseService.query(query);
  }

  async getCodeById(id: string) {
    const query = `
      SELECT * FROM activation_codes
      WHERE id = $1
    `;

    const result = await this.databaseService.query(query, [id]);

    if (!result || result.length === 0) {
      throw new NotFoundException('Activation code not found');
    }

    return result[0];
  }

  async updateCode(id: string, updateDto: UpdateActivationCodeDto) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateDto.status) {
      updates.push(`status = $${paramIndex}`);
      values.push(updateDto.status);
      paramIndex++;
    }

    if (updateDto.used_at) {
      updates.push(`used_at = $${paramIndex}`);
      values.push(updateDto.used_at);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE activation_codes
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.databaseService.query(query, values);

    if (!result || result.length === 0) {
      throw new NotFoundException('Activation code not found');
    }

    return result[0];
  }

  async deleteCode(id: string) {
    const query = `
      DELETE FROM activation_codes
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.databaseService.query(query, [id]);

    if (!result || result.length === 0) {
      throw new NotFoundException('Activation code not found');
    }

    return { message: 'Activation code deleted successfully' };
  }

  private generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
