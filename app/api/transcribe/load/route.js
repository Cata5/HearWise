import redis from "../../../lib/redis";
import crypto from "crypto";

export async function GET(req) {
  try {
    // Extract email from query string using req.nextUrl
    const email = req.nextUrl.searchParams.get('email'); // Extract email from query params

    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log("Received email:", email);

    // Hash the email to use as a key for Redis
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    const transcriptionKey = `accounts:${hashedEmail}`; // The key remains `accounts:{hashedEmail}`
    const transcriptionField = 'transcripts'; // Field for storing transcriptions

    console.log('Using transcription key:', transcriptionKey); // Log the Redis key

    // Test Redis connection
    await redis.ping();
    console.log("Redis connected successfully");

    // Retrieve the transcription data from Redis
    const currentData = await redis.hget(transcriptionKey, transcriptionField);

    // Parse the data as JSON, or return an empty array if no data exists
    let transcriptions = [];
    if (currentData) {
      try {
        transcriptions = JSON.parse(currentData);
      } catch (e) {
        console.error('Error parsing transcription data:', e);
      }
    }

    // Return the transcription data in the response
    return new Response(
      JSON.stringify({ transcriptions }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error loading transcription:", error);
    return new Response(
      JSON.stringify({ message: "Error loading transcription." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
