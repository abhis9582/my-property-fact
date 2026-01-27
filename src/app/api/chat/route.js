import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/_global_components/chatbotLogic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { sessionId, message } = body;

        if (!sessionId || !message) {
            return NextResponse.json(
                { error: 'Session ID and message are required' },
                { status: 400 }
            );
        }

        const response = await generateAIResponse(message, sessionId);
        
        return NextResponse.json(response);
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', reply: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
