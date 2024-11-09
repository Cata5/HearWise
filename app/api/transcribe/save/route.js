import bcrypt from 'bcrypt';
import redis from '../../../lib/redis';
import jwt from 'jsonwebtoken';  // Import JWT for decoding the token

// Helper function to hash the email
async function hashEmail(email) {
  const saltRounds = 10;
  const hashedEmail = await bcrypt.hash(email, saltRounds);
  return hashedEmail;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, transcription } = req.body;
    const token = req.headers.authorization?.split(" ")[1];  // Extract token from Authorization header

    // Ensure all required fields are present
    if (!name || !transcription || !token) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      // Decode the JWT to get the user's email
      const decodedToken = jwt.verify(token, 'your-secret-key');  // Use the same secret key you use for signing JWTs
      const email = decodedToken.email;  // Assuming the email is stored in the token

      // Hash the email before saving in Redis
      const hashedEmail = await hashEmail(email);

      // Construct the Redis key for transcription data
      const userTranscribeKey = `accounts:${hashedEmail}:transcribes`;

      // Get existing transcription data from Redis (if it exists)
      const existingTranscriptions = await redis.get(userTranscribeKey);

      let transcriptions = {};

      if (existingTranscriptions) {
        // Parse existing transcriptions if they exist
        transcriptions = JSON.parse(existingTranscriptions);
      }

      // Dynamically add the transcription
      transcriptions[name] = transcription;

      // Save the updated transcription data back into Redis
      await redis.set(userTranscribeKey, JSON.stringify(transcriptions));

      // Return a success response
      return res.status(200).json({
        success: true,
        message: "Transcription saved successfully",
        data: transcriptions,
      });
    } catch (error) {
      console.error("Error saving transcription:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
