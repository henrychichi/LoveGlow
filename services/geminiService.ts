// Fix: Implement the geminiService to fetch dynamic challenges from the Gemini API.
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { RelationshipStatus, Challenge } from '../types';

// Per guidelines, initialize with apiKey from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface GeminiChallengeResponse {
  type: string;
  content: string;
}

// Helper function to retry async operations
async function retryOperation<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
}

export const getDailyChallenges = async (status: RelationshipStatus): Promise<Challenge[]> => {
  let prompt: string;

  if (status === RelationshipStatus.DATING || status === RelationshipStatus.MARRIED) {
    prompt = `You are a creative and insightful relationship coach AI. Generate a set of 5 diverse, fun, and meaningful daily challenges for a couple whose relationship status is '${status}'. These challenges should help them deepen their connection, introduce excitement, and foster teamwork and romance.

The set should include a mix of the following categories:
- 'Deep Conversation Starter': A thought-provoking question.
- 'Romantic Gesture': A specific, creative, and romantic act.
- 'Shared Adventure': A fun activity to do together.
- 'Teamwork Challenge': A task where they must work together.
- 'Memory Lane': A prompt to reminisce about a positive memory.
- 'Spicy Dare': A fun, flirty challenge to increase intimacy.
- 'Date Night Idea': A simple, actionable plan for a date.

IMPORTANT: The 'content' for each challenge must be a short, direct instruction or question, under 15 words. For example:
- A 'Spicy Dare' could be "Give your partner a passionate 20-second kiss unexpectedly."
- A 'Date Night Idea' could be "Plan a surprise mini-date for this week, even just for an hour."
- A 'Romantic Gesture' could be "Secretly leave a heartfelt note where your partner will find it."
- A 'Teamwork Challenge' could be "Declutter one part of a room together in 30 minutes. Go!".

Provide the output in a JSON array format. Each object in the array must have a 'type' (the category name) and a 'content' (the short challenge description). Generate exactly 5 challenges, with a variety of types, ensuring some focus on romance and intimacy.`;
  } else { // For RelationshipStatus.SINGLE
    prompt = `You are an empowering and fun life coach AI. Generate 3 unique and exciting daily challenges for a single person, focusing on self-love, personal growth, and embracing singlehood.

The challenges should be a mix of these categories:
- 'Mindful Moment': A practice to connect with the present.
- 'Self-Date Idea': A fun activity to do alone.
- 'Comfort Zone Stretch': A small step to try something new.
- 'Act of Kindness': A challenge to spread positivity.
- 'Gratitude Practice': A prompt to appreciate the good things.

IMPORTANT: The 'content' for each challenge must be short and to the point, under 15 words. For example, a 'Self-Date Idea' could be "Visit a bookstore and read the first chapter of a random book." A 'Comfort Zone Stretch' could be "People-watch in a park for 15 minutes without your phone."

Provide the output in a JSON array format. Each object in the array must have a 'type' (the category) and a 'content' (the short challenge description). Generate exactly 3 challenges.`;
  }

  // Use retry logic for the API call
  return retryOperation(async () => {
    try {
        const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Using gemini-2.5-flash for basic text tasks
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                type: {
                    type: Type.STRING,
                    description: "The category of the challenge, e.g., 'Question for Him', 'Shared Activity'."
                },
                content: {
                    type: Type.STRING,
                    description: "The description of the challenge."
                }
                },
                required: ['type', 'content']
            }
            }
        }
        });

        const jsonString = response.text?.trim();
        if (!jsonString) {
            throw new Error("Received an empty response from the AI.");
        }
        const challengesFromAI: GeminiChallengeResponse[] = JSON.parse(jsonString);

        if (!Array.isArray(challengesFromAI) || challengesFromAI.length === 0) {
        throw new Error("AI did not return a valid list of challenges.");
        }
        
        return challengesFromAI.map(c => ({
        ...c,
        completed: false,
        }));

    } catch (error) {
        console.error('Error fetching daily challenges from Gemini API:', error);
        // Provide a more user-friendly error message
        if (error instanceof Error && error.message.includes('json')) {
            throw new Error('Failed to generate challenges. The AI response was not in the expected format.');
        }
        throw error; // Re-throw to trigger retry
    }
  }, 3, 1000); // 3 retries, starting with 1s delay
};

export const createAdviceChat = (status: RelationshipStatus): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are "LoveGrow Coach", a compassionate AI relationship assistant. A user, whose current relationship status is '${status}', is chatting with you for advice. Provide short, straightforward, and supportive answers. Keep your responses concise, empathetic, and to the point. Do not use markdown formatting.`,
    },
  });
};