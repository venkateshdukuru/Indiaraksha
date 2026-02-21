import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findById(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    async updateProfile(userId: string, updateData: any) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true },
        );

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            message: 'Profile updated successfully',
            user,
        };
    }

    async getProfile(userId: string) {
        const user = await this.findById(userId);
        return user;
    }
}
