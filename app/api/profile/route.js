import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from '../../lib/redis'; // Adjust as necessary

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const authorization = req.headers.get('Authorization'); // Adjusted for correct header retrieval

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return new Response('Authorization token is required', { status: 401 });
    }

    const token = authorization.split(' ')[1]; // Extract the token from the 'Bearer' format
    
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;
    
    // Hash the email to create a unique key for Redis
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    
    // Retrieve user data from Redis
    const userData = await redis.hgetall(`accounts:${hashedEmail}`);
    
    if (!userData || !userData.name) {
      return new Response('User not found', { status: 404 });
    }

    // Return both name and email in the response
    return new Response(JSON.stringify({ name: userData.name, email: email }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);

    // Return a more specific status code based on the error
    if (error.name === 'JsonWebTokenError') {
      return new Response('Invalid or expired token', { status: 401 });
    }
    return new Response('Error fetching user data', { status: 500 });
  }
}
