// pages/api/transcribe/[name].js
import redis from '../../../lib/redis'; // Adjust path if necessary
import crypto from 'crypto';

export default async function handler(req, res) {
  const { name } = req.query;  // Access the dynamic route parameter
  const email = req.headers.email;  // Retrieve email from headers

  if (!email) {
    return res.status(400).json({ error: 'Email not provided' });
  }

  try {
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    const redisKey = `accounts:${hashedEmail}`;

    const transcriptsData = await redis.hget(redisKey, 'Transcripts');

    if (transcriptsData) {
      const transcriptions = JSON.parse(transcriptsData);
      const transcription = transcriptions[name];

      if (transcription) {
        return res.status(200).json({
          name,
          transcription,
        });
      } else {
        return res.status(404).json({ error: 'Transcription not found for this name.' });
      }
    } else {
      return res.status(404).json({ error: 'No transcriptions found for this user.' });
    }
  } catch (error) {
    console.error('Error fetching transcription:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
