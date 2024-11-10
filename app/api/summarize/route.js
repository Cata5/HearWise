import ollama from 'ollama'; // Ensure you have this package installed
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body to get the userMessage
    const { userMessage } = await request.json();

    // Validate that userMessage is provided
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Call the model to generate a summary of the user message
    const modelResponse = await generateSummary(userMessage);

    // Return the summary as the response
    return NextResponse.json({ summary: modelResponse });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 500 });
  }
}

// Function to communicate with the model and generate a summary
const generateSummary = async (message) => {
  try {
    const response = await ollama.chat({
      model: 'gemma2:9b',
      messages: [
        {
          role: 'user',
          content: `${message}. Please summarize the following message succinctly.`,
        },
      ],
    });

    // Return the model's summary response, defaulting to a fallback message if not found
    return response?.message?.content || 'No summary provided by the model.';
  } catch (error) {
    console.error('Error communicating with model:', error);
    throw new Error('Model summarization failed');
  }
};
