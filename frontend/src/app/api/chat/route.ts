import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import knowledgeBase from '@/data/knowledge_base.json';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { message, history, userData } = await req.json();

        // Inject Knowledge Base and User context into System Prompt
        const systemPrompt = `
            You are Befin's intelligent Parent and Student Assistant Agent.
            Your job is to provide helpful answers regarding the Befin platform and teach basic financial literacy.
            You must be concise, helpful, and strictly focus on finance and the Befin platform.

            Knowledge Base: ${JSON.stringify(knowledgeBase)}
            
            Current User Context (if valid, use it to personalize the experience, otherwise give general answers):
            ${JSON.stringify(userData)}

            Important Rules:
            1. Do NOT answer any coding questions, medical questions, or general knowledge questions outside of finance or the Befin platform. If someone asks an unrelated question, politely decline and steer them back to finance.
            2. Do NOT assume the user is new to the platform just because this is a new chat conversation. Treat the user as a returning user unless they explicitly state otherwise.
            3. Use the provided user context to personalize the conversation (e.g. refer to their username or balance if helpful), but do not make up or hallucinate any other profile information.
        `;

        // Attempt generation with fallback models
        const approaches = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'];

        for (const model of approaches) {
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...history,
                        { role: 'user', content: message }
                    ],
                    model: model,
                });

                return NextResponse.json({ reply: chatCompletion.choices[0].message.content });
            } catch (e) { 
                console.error(`Failed with model ${model}:`, e);
                continue; 
            }
        }

        throw new Error("All Groq models failed");
    } catch (error: any) {
        console.error("Chatbot API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch reply from AI' }, { status: 500 });
    }
}
