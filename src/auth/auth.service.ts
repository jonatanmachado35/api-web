import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SafeUser } from '../users/user.entity';

interface TokenPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashedPassword, name);
    const tokens = await this.generateTokens({ sub: user.id, email: user.email });
    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = { sub: user.id, email: user.email };
    const tokens = await this.generateTokens(payload);
    return { user: this.toSafeUser(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.jwtRefreshSecret,
      });
      const tokens = await this.generateTokens(payload);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return { user, ...tokens };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  private toSafeUser(user: { id: number; email: string; name: string; createdAt: Date }) {
    const { id, email, name, createdAt } = user;
    const safeUser: SafeUser = { id, email, name, createdAt };
    return safeUser;
  }
}
