import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    const response = await fetch("https://lexica.qewertyy.dev/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "AverageNews",
            content: "You are a professional news summarizer. Your task is to provide a clear, engaging, and accurate 2-3 sentence summary that captures the key points and maintains the reader's interest. Focus on the most important facts while preserving the context and significance of the news."
          },
          {
            role: "user",
            content: `Please provide a concise and engaging summary of this news article: ${content}`
          }
        ],
        model_id: 5
      })
    });

    const data = await response.json();
    return NextResponse.json({ summary: data.content });
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json({ error: 'Failed to summarize content' }, { status: 500 });
  }
} 