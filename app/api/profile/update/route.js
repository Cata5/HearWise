import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from '../../../lib/redis'; // Adjust as necessary

const JWT_SECRET = process.env.JWT_SECRET;

export async function PUT(req) {
  try {
    // Extract the Authorization token from the request headers
    const authorization = req.headers.get('Authorization');
    
    // If no authorization token is present, return a 401 error
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return new Response('Authorization token is required', { status: 401 });
    }

    // Extract the token from the Authorization header
    const token = authorization.split(' ')[1];
    
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;
    
    // Hash the email to store it securely in Redis
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    
    // Parse the JSON body of the request to get the new name
    const { name } = await req.json();
    
    // If the name is not provided, return a 400 error
    if (!name) {
      return new Response('Name is required', { status: 400 });
    }

    // Update the user data in Redis (only the name)
    await redis.hset(`accounts:${hashedEmail}`, 'name', name);
    
    // Return a success response
    return new Response('User data updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error updating user data:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return new Response('Invalid or expired token', { status: 401 });
    }

    // Generic error handler
    return new Response('Error updating user data', { status: 500 });
  }
}
