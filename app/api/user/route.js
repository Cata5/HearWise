import jwt from 'jsonwebtoken';
import redis from '../../lib/redis';
import crypto from 'crypto';

function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

export async function GET(req) {
  try {
    const authorization = req.headers.get('Authorization'); // Ensure this line is correct

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.warn('Authorization token is missing or invalid'); // Debugging line
      return new Response('Authorization token is required', { status: 401 });
    }

    const token = authorization.split(' ')[1];
    
    // Log the token for debugging (make sure to remove it later for security)
    console.log('Received token:', token);

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Log decoded token for debugging

    const { email } = decoded;

    const hashedEmail = hashEmail(email);
    
    // Retrieve user data from Redis
    const userData = await redis.hgetall(`accounts:${hashedEmail}`);
    console.log('User data from Redis:', userData); // Log retrieved user data

    if (!userData) {
      console.warn('User not found in Redis'); // Debugging line
      return new Response('User not found', { status: 404 });
    }

    return new Response(JSON.stringify({
      name: userData.name,
      role: userData.role, // Make sure to include role here
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error.name === 'JsonWebTokenError') {
      return new Response('Invalid or expired token', { status: 401 });
    } else {
      return new Response('Error fetching user data', { status: 500 });
    }
  }
}
