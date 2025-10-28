import { GoogleGenAI } from '@google/genai';
import { Message } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY  });

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];

    const context = await getContext(lastMessage.content, fileKey);
    if (context === null) {
      console.error("Failed to get context for query:", lastMessage.content);
      return NextResponse.json({ error: "Failed to retrieve context" }, { status: 500 });
    }

    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    });

    const previousTurn = (() => {
      if (messages.length < 2) return "";
      const prev = messages[messages.length - 2];
      return `${prev.role === "user" ? "User" : "Assistant"}: ${prev.content}`;
    })();

    let conversationText = `You are a precise PDF Q&A assistant.
You have access ONLY to the provided CONTEXT which is extracted from the user's PDF.
Your job is to answer the MOST RECENT user message only. Do not answer or repeat earlier questions.
If the answer is not in CONTEXT, reply exactly: "I'm sorry, but I don't know the answer to that question." Do not speculate.
Prefer short, direct answers. For facts such as a person's name, IDs, dates, CGPA, email, phone, etc., answer with just the value(s) found. If multiple candidates exist, list them clearly.
Do not infer or generalize field meanings; answer only what is explicitly asked.
Do not give 1 word answers. Answer in sentences with proper context according to the question asked.

START CONTEXT
${context}
END CONTEXT

${previousTurn ? `Recent exchange:\n${previousTurn}\n` : ""}User: ${lastMessage.content}
Assistant:`;

    try {
      console.log(`Requesting Gemini response for conversation of length ${conversationText.length}`);
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: conversationText }]
        }],
      });

      if (!result || !result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
        console.error('No valid response returned from Gemini API', result);
        throw new Error('No valid response returned from Gemini API');
      }

      const firstCandidate = result.candidates[0];
      const contentParts = firstCandidate.content!.parts;

      if (!contentParts || contentParts.length === 0 || typeof contentParts[0].text !== 'string') {
        console.error('Invalid content structure in Gemini API response', firstCandidate);
        throw new Error('Invalid content structure in Gemini API response');
      }

      const aiResponse = contentParts[0].text;
      console.log('Generated response:', aiResponse);

      await db.insert(_messages).values({
        chatId,
        content: aiResponse,
        role: "system",
      });

      return new Response(aiResponse, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    } catch (error) {
      console.error("Error generating content with Gemini:", error);
      return NextResponse.json({ error: "Failed to generate response from AI" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "An error occurred during the chat request" }, { status: 500 });
  }
}