import { GoogleGenAI } from "@google/genai";
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await generateAIResponseStream(message, controller)
          controller.close()
        } catch (error) {
          console.error('Error in stream:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

const ai = new GoogleGenAI({});

const generateAIResponseStream = async (
  message: string, 
  controller: ReadableStreamDefaultController
) => {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: message,
      config: {
        systemInstruction: "You are a video game journalist being interviewed. Your name is Neko. Provide informative, engaging responses about gaming topics.",
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        // Send each chunk as a Server-Sent Event
        const data = JSON.stringify({ text: chunk.text })
        controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
      }
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    // Send error message as a chunk
    const fallbackMessage = `I'm having trouble connecting to my knowledge base right now. Here's what I can tell you: Gaming is constantly evolving with new releases and updates. Could you try asking your question again?`
    const data = JSON.stringify({ text: fallbackMessage })
    controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
  }
}
