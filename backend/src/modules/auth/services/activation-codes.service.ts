import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { 
  GenerateActivationCodeDto, 
  CreateActivationCodeDto, 
  UpdateActivationCodeDto 
} from '../dto/activation-code.dto';

@Injectable()
export class ActivationCodesService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async generateCode(generateDto: GenerateActivationCodeDto) {
    const client = await this.pool.connect();
    try {
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

      const result = await client.query(query, [
        code,
        generateDto.email,
        expiresAt.toISOString(),
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async verifyCode(code: string) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM activation_codes
        WHERE code = $1 AND status = 'pending' AND expires_at > NOW()
      `;

      const result = await client.query(query, [code]);

      if (!result.rows || result.rows.length === 0) {
        throw new BadRequestException('Invalid or expired activation code');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async useCode(code: string) {
    const client = await this.pool.connect();
    try {
      const query = `
        UPDATE activation_codes
        SET status = 'used', used_at = NOW()
        WHERE code = $1 AND status = 'pending'
        RETURNING *
      `;

      const result = await client.query(query, [code]);

      if (!result.rows || result.rows.length === 0) {
        throw new BadRequestException('Invalid or already used activation code');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getAllCodes() {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM activation_codes
        ORDER BY created_at DESC
      `;

      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getCodeById(id: string) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM activation_codes
        WHERE id = $1
      `;

      const result = await client.query(query, [id]);

      if (!result.rows || result.rows.length === 0) {
        throw new NotFoundException('Activation code not found');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateCode(id: string, updateDto: UpdateActivationCodeDto) {
    const client = await this.pool.connect();
    try {
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

      const result = await client.query(query, values);

      if (!result.rows || result.rows.length === 0) {
        throw new NotFoundException('Activation code not found');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async deleteCode(id: string) {
    const client = await this.pool.connect();
    try {
      const query = `
        DELETE FROM activation_codes
        WHERE id = $1
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (!result.rows || result.rows.length === 0) {
        throw new NotFoundException('Activation code not found');
      }

      return { message: 'Activation code deleted successfully' };
    } finally {
      client.release();
    }
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
