import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';
import { USER_ROLES } from '../../constants/roles.js';

const registerUser = async (payload) => {
  const { fullName, phone, email, password, role } = payload;

  if (!fullName) {
    throw new Error('Full name is required');
  }

  const existingUserByPhone = await prisma.user.findUnique({
    where: { phone },
  });

  if (existingUserByPhone) {
    throw new Error('Phone number already exists');
  }

  if (email) {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }
  }

  // শুধু এই তিনটা role self-register করতে পারবে
  const allowedRoles = [USER_ROLES.TENANT, USER_ROLES.LANDLORD, USER_ROLES.RESIDENT];
  const userRole = role && allowedRoles.includes(role) ? role : USER_ROLES.TENANT;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: fullName,
      phone: phone,
      email: email,
      password: hashedPassword,
      role: userRole,
      // RESIDENT auto-approved, বাকিরা admin approval লাগবে
      isApproved: userRole === USER_ROLES.RESIDENT,
    },
  });

  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isApproved: user.isApproved,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const loginUser = async (payload) => {
  const { phone, password } = payload;

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  if (!user.isApproved) {
    throw new Error('Account not approved yet');
  }

  if (!user.password) {
    throw new Error('This account does not have password login');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      phone: user.phone,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isApproved: user.isApproved,
    },
  };
};

const socialLoginUser = async (payload) => {
  const { fullName, email, provider } = payload;

  if (!email) {
    throw new Error('Email is required for social login');
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        fullName: fullName || 'Social User',
        email: email,
        phone: `SOCIAL-${Date.now()}`,
        password: null,
        role: USER_ROLES.RESIDENT,
        isApproved: true,
      },
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      phone: user.phone,
      role: user.role,
      provider: provider || 'social',
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isApproved: user.isApproved,
    },
  };
};

export const authService = {
  registerUser,
  loginUser,
  socialLoginUser,
};