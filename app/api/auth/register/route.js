import redis from '../../../lib/redis';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

async function generateUniqueUserId() {
  return crypto.randomUUID();
}

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response('Email, password, and name are required', { status: 400 });
    }

    // Hash the email
    const hashedEmail = hashEmail(email);

    // Check if user already exists
    const existingUser = await redis.hgetall(`accounts:${hashedEmail}`);
    if (existingUser && existingUser.email) {
      return new Response('User already exists', { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique user ID
    const userId = await generateUniqueUserId();

    // Define the static role for the user
    const role = 'user'; // Static role

    // Store user data in Redis
    await redis.hset(`accounts:${hashedEmail}`, {
      userId,
      name,
      hashedPassword,
      role, // Add the role to the stored data
    });

    // Generate a JWT token
    const token = jwt.sign(
      {
        sub: userId,
        email,
        name,
        role, // Include the role in the JWT payload
        likedRecipes: JSON.stringify([]),
      },
      process.env.JWT_SECRET,
      { expiresIn: '480h' }
    );

    return new Response(JSON.stringify({ message: 'Registration successful', token }), { status: 201 });
  } catch (error) {
    console.error('Error registering:', error);
    return new Response('Error registering', { status: 500 });
  }
}
