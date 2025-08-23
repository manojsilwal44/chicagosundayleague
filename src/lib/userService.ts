import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName?: string | null;
  avatar?: string | null;
  isVerified: boolean;
  createdAt: Date;
}

export interface LoginData {
  email: string;
  password: string;
}

export class UserService {
  /**
   * Create a new user with profile
   */
  static async createUser(userData: CreateUserData): Promise<UserProfile> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
        include: { profile: true }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password with salt
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);
      
      // Generate a unique salt for additional security
      const passwordSalt = crypto.randomBytes(32).toString('hex');

      // Create user and profile in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: userData.email,
            passwordHash,
            passwordSalt,
            isVerified: false, // Email verification required
            accounts: {
              create: {
                type: 'email',
                provider: 'email',
                providerAccountId: userData.email,
                isVerified: false
              }
            }
          }
        });

        // Create user profile
        const profile = await tx.userProfile.create({
          data: {
            userId: user.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            displayName: `${userData.firstName} ${userData.lastName}`,
            preferences: {
              create: {
                language: 'en',
                theme: 'light',
                emailNotifications: true,
                pushNotifications: true,
                privacyLevel: 'PUBLIC',
                eventNotifications: true
              }
            }
          }
        });

        return { user, profile };
      });

      // Return user profile data
      return {
        id: result.user.id,
        firstName: result.profile.firstName,
        lastName: result.profile.lastName,
        email: result.user.email,
        displayName: result.profile.displayName,
        avatar: result.profile.avatar,
        isVerified: result.user.isVerified,
        createdAt: result.user.createdAt
      };

    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   */
  static async authenticateUser(loginData: LoginData): Promise<UserProfile> {
    try {
      // Find user with profile
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
        include: { profile: true }
      });

      if (!user || !user.profile) {
        throw new Error('Invalid email or password');
      }

      if (!user.passwordHash) {
        throw new Error('Account not set up for password authentication');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Check if account is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Return user profile data
      return {
        id: user.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email,
        displayName: user.profile.displayName,
        avatar: user.profile.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      };

    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user || !user.profile) {
        return null;
      }

      return {
        id: user.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email,
        displayName: user.profile.displayName,
        avatar: user.profile.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      };

    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            update: {
              firstName: updates.firstName,
              lastName: updates.lastName,
              displayName: updates.displayName,
              avatar: updates.avatar
            }
          }
        },
        include: { profile: true }
      });

      if (!user.profile) {
        throw new Error('User profile not found');
      }

      return {
        id: user.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email,
        displayName: user.profile.displayName,
        avatar: user.profile.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      };

    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Delete user account
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id: userId }
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      return !!user;
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  }
}
