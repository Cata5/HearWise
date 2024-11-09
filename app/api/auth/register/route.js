import redis from '../../../lib/redis';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Function to hash the email for uniqueness
function hashEmail(email) {
  // Sanitize email by trimming and converting to lowercase
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

// Function to generate a unique user ID
async function generateUniqueUserId() {
  return crypto.randomUUID();
}

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response('Email, password, and name are required', { status: 400 });
    }

    // Hash the email to ensure uniqueness
    const hashedEmail = hashEmail(email);

    // Check if a user with this email already exists in Redis
    const existingUser = await redis.hgetall(`accounts:${hashedEmail}`);
    if (existingUser && existingUser.email) {
      // If user exists, do not modify any data, just return an error message
      return new Response('Email already in use. Please try another one.', { status: 400 });
    }

    // Hash the password for security (using bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique user ID
    const userId = await generateUniqueUserId();

    // Define the static role for the user
    const role = 'user';

    // Store the new user's data in Redis
    await redis.hset(`accounts:${hashedEmail}`, {
      userId,
      name,
      hashedPassword,
      role,
    });

    // Generate a JWT token for the user
    const token = jwt.sign(
      {
        sub: userId, // Subject is the user ID
        email,
        name,
        role, // Include the role in the JWT payload
      },
      process.env.JWT_SECRET, // Use the JWT secret stored in environment variables
      { expiresIn: '480h' } // Set token expiration to 480 hours (20 days)
    );

    // Return a success response with the JWT token
    return new Response(JSON.stringify({ message: 'Registration successful', token }), { status: 201 });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error('Error registering:', error);
    return new Response('Error registering', { status: 500 });
  }
}
