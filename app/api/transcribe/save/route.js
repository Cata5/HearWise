// Import the Redis instance from lib/redis
import redis from '../lib/redis';

// Function to save the transcription
const saveTranscription = async (userId, transcription) => {
  try {
    // Store the transcription in Redis with a key like transcription:{userId}
    await redis.set(`transcription:${userId}`, transcription);
    console.log('Transcription saved!');
  } catch (error) {
    console.error('Error saving transcription:', error);
  }
};

// Function to retrieve the transcription
const getTranscription = async (userId) => {
  try {
    // Retrieve the transcription using the key
    const transcription = await redis.get(`transcription:${userId}`);
    if (transcription) {
      console.log('Transcription retrieved:', transcription);
      return transcription;
    } else {
      console.log('No transcription found for user:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving transcription:', error);
    return null;
  }
};

// Example usage
const userId = 'user123';
const transcriptionText = 'This is a transcribed audio text.';

// Save transcription
saveTranscription(userId, transcriptionText);

// Retrieve transcription
getTranscription(userId);
