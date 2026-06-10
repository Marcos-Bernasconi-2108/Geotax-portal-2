import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let userId = 'user-123';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      // Token validation here if needed
    }

    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Missing question' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Eres un asistente contable experto en impuestos argentinos. Responde esta pregunta de forma clara y profesional: ${question}`,
        },
      ],
    });

    const response = (message.content[0] as { type: string; text: string }).text;

    const { error: dbError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        question,
        response,
      });

    if (dbError) {
      console.error('DB Error:', dbError);
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}