import OpenAI from 'openai';
import { Env } from './env';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface BuyOrNotQuestion {
  question: string;
  options: string[];
}

export interface BuyOrNotVerdict {
  isImpulsive: boolean;
  reasoning: string;
  advice: string[];
}

interface QuestionsResponse {
  questions: BuyOrNotQuestion[];
}

export async function generateBuyOrNotQuestions(
  product: string,
): Promise<BuyOrNotQuestion[]> {
  const prompt = `You are a financial advisor helping someone decide if they should buy "${product}". 
Generate 4 questions that will help determine if this is an impulsive purchase or a well-thought-out decision.
Each question should have 3 options that represent different levels of consideration.
Format the response as a JSON array of questions, where each question has a "question" string and "options" array of strings.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content ?? '{"questions": []}';
  const response = JSON.parse(content) as QuestionsResponse;
  return response.questions;
}

export async function generateBuyOrNotVerdict(
  product: string,
  answers: { question: string; answer: string }[],
): Promise<BuyOrNotVerdict> {
  const prompt = `You are a financial advisor helping someone decide if they should buy "${product}".
Based on their answers to the following questions:

${answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Determine if this is an impulsive purchase or a well-thought-out decision, you should have in mind that the user is trying to save money and control impulsive spending.
Provide your reasoning and specific advice.
Format the response as a JSON object with:
- isImpulsive: boolean
- reasoning: string
- advice: string[] (array of specific advice points)`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
  });

  const content =
    completion.choices[0].message.content ??
    '{"isImpulsive": false, "reasoning": "", "advice": []}';
  return JSON.parse(content) as BuyOrNotVerdict;
}
