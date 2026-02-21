import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto, ip?: string) {
        const { email, mobile, password, name, city, state } = registerDto;

        // Check if user exists
        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { mobile }],
        });

        if (existingUser) {
            throw new ConflictException(
                'User with this email or mobile already exists',
            );
        }

        // Hash password — parseInt() is mandatory: ConfigService returns env values
        // as strings, and bcrypt.hash() requires a NUMBER for rounds (not a string).
        // Passing the string "10" as the second arg causes "Invalid salt" error.
        const rounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS') || '10', 10);
        const hashedPassword = await bcrypt.hash(password, rounds);

        // Create user
        const user = await this.userModel.create({
            email,
            mobile,
            password: hashedPassword,
            name,
            city,
            state,
            lastLoginIp: ip,
            lastLoginAt: new Date(),
        });

        // Generate tokens
        const tokens = await this.generateTokens(user);

        // Save refresh token
        await this.userModel.findByIdAndUpdate(user._id, {
            $push: { refreshTokens: tokens.refreshToken },
        });

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async login(loginDto: LoginDto, ip?: string) {
        const { email, password } = loginDto;

        // Find user with password
        const user = await this.userModel.findOne({ email }).select('+password');

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.userModel.findByIdAndUpdate(user._id, {
            lastLoginIp: ip,
            lastLoginAt: new Date(),
        });

        // Generate tokens
        const tokens = await this.generateTokens(user);

        // Save refresh token
        await this.userModel.findByIdAndUpdate(user._id, {
            $push: { refreshTokens: tokens.refreshToken },
        });

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const user = await this.userModel.findById(payload.sub);

            if (!user || !user.refreshTokens.includes(refreshToken)) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Remove old refresh token
            await this.userModel.findByIdAndUpdate(user._id, {
                $pull: { refreshTokens: refreshToken },
            });

            // Generate new tokens
            const tokens = await this.generateTokens(user);

            // Save new refresh token
            await this.userModel.findByIdAndUpdate(user._id, {
                $push: { refreshTokens: tokens.refreshToken },
            });

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string, refreshToken: string) {
        await this.userModel.findByIdAndUpdate(userId, {
            $pull: { refreshTokens: refreshToken },
        });

        return { message: 'Logged out successfully' };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ email }).select('+password');

        // Guard: if password field is somehow missing, avoid bcrypt "Invalid salt"
        if (!user || !user.password) return null;

        if (await bcrypt.compare(password, user.password)) {
            return this.sanitizeUser(user);
        }

        return null;
    }

    private async generateTokens(user: User) {
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '15m',
        };
    }

    private sanitizeUser(user: any) {
        const userObject = user.toObject ? user.toObject() : user;
        delete userObject.password;
        delete userObject.refreshTokens;
        return userObject;
    }
}
