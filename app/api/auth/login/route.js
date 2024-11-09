import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redis from '../../../lib/redis';

function hashEmail(email) {
  // Sanitize email by trimming and converting to lowercase
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check for email and password presence
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Hash the provided email
    const hashedEmail = hashEmail(email);

    // Retrieve user data from Redis
    const userData = await redis.hgetall(`accounts:${hashedEmail}`);

    // Check if user data exists and has a hashed password
    if (!userData || Object.keys(userData).length === 0 || !userData.hashedPassword) {
      console.error(`User with email ${email} not found in Redis.`);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate the provided password against the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);

    // If password is invalid, return an unauthorized response
    if (!isPasswordValid) {
      console.error(`Invalid password attempt for user: ${email}`);
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate JWT token including user data
    const token = jwt.sign(
      {
        sub: userData.userId,
        email: email,
        name: userData.name,
        role: userData.role, // Ensure you're getting the role from userData
      },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is set in the environment
      { expiresIn: '480h' } // Token expiration time of 20 days
    );

    // Return the token in a successful response
    return new Response(
      JSON.stringify({ token }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(
      JSON.stringify({ error: 'Error logging in' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
