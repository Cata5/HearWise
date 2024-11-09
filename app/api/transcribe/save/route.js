import redis from "../../../lib/redis";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email, name, transcription } = await req.json();
    console.log("Received transcription data:", { email, name, transcription });

    // Validate that the required fields are provided
    if (!email || !name || !transcription) {
      return new Response(
        JSON.stringify({ message: "Email, name, and transcription are required." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the email to use as a key for Redis
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    const transcriptionKey = `accounts:${hashedEmail}`; // The key remains `accounts:{hashedEmail}`
    const transcriptionField = 'transcripts'; // Field for storing transcriptions

    console.log('Using transcription key:', transcriptionKey); // Log the Redis key

    // Test Redis connection
    await redis.ping();
    console.log("Redis connected successfully");

    const transcriptionData = {
      name,
      transcription,
      timestamp: new Date().toISOString(),
    };

    try {
      // Check if the key exists and if it's a hash
      const keyType = await redis.type(transcriptionKey);
      if (keyType !== 'hash') {
        console.log(`Key type is '${keyType}', creating a new hash.`);
        await redis.hset(transcriptionKey, transcriptionField, JSON.stringify([])); // Initialize the field as an empty array if not a hash
      }

      // Get the current transcription data if it exists
      const currentData = await redis.hget(transcriptionKey, transcriptionField);

      // Parse the current data as JSON or use an empty array if not valid JSON
      let transcriptions = [];
      try {
        transcriptions = currentData ? JSON.parse(currentData) : [];
      } catch (e) {
        console.error('Error parsing existing transcription data, initializing as empty array:', e);
      }

      // Ensure we have an array before pushing new data
      if (!Array.isArray(transcriptions)) {
        transcriptions = [];
      }

      // Append the new transcription data
      transcriptions.push(transcriptionData);

      // Store the updated transcription data in Redis
      await redis.hset(transcriptionKey, transcriptionField, JSON.stringify(transcriptions));

      console.log("Transcription saved successfully");

      return new Response(
        JSON.stringify({ message: "Transcription saved successfully." }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (redisError) {
      console.error('Error saving transcription to Redis:', redisError);
      return new Response(
        JSON.stringify({ message: "Error saving transcription." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error processing transcription:", error);
    return new Response(
      JSON.stringify({ message: "Error processing transcription." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
