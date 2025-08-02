import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface VoiceSession {
  id: string
  startTime: Date
  conversationHistory: ConversationMessage[]
}

// Store active sessions (in production, use Redis or database)
const activeSessions = new Map<string, VoiceSession>()

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, audioData } = await request.json()
    
    console.log(`[Voice Chat] Action: ${action}, SessionId: ${sessionId}`)
    console.log(`[Voice Chat] Active sessions: ${Array.from(activeSessions.keys()).join(', ')}`)
    
    if (action === 'start') {
      return await startSession(sessionId)
    } else if (action === 'send_audio') {
      return await sendAudio(sessionId, audioData)
    } else if (action === 'end') {
      return await endSession(sessionId)
    }
    
    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Voice chat API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function startSession(sessionId: string) {
  try {
    // Initialize session with conversation history
    const session: VoiceSession = {
      id: sessionId,
      startTime: new Date(),
      conversationHistory: []
    }
    activeSessions.set(sessionId, session)
    console.log(`[Voice Chat] Starting voice session: ${sessionId}`)
    console.log(`[Voice Chat] Session created successfully, total sessions: ${activeSessions.size}`)
    return Response.json({ success: true, sessionId })
  } catch (error) {
    console.error('Error starting session:', error)
    return Response.json({ error: 'Failed to start session' }, { status: 500 })
  }
}

async function sendAudio(sessionId: string, audioData: string) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key not configured')
    }

    console.log(`[Voice Chat] Looking for session: ${sessionId}`)
    console.log(`[Voice Chat] Available sessions: ${Array.from(activeSessions.keys()).join(', ')}`)
    
    const session = activeSessions.get(sessionId)
    if (!session) {
      console.error(`[Voice Chat] Session ${sessionId} not found in active sessions`)
      throw new Error('Session not found')
    }

    console.log(`[Voice Chat] Session found, processing audio...`)

    // Use Gemini 1.5 Flash for multimodal capabilities
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    // Create conversation context from history
    const conversationContext = session.conversationHistory
      .map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`)
      .join('\n')
    
    try {
      // Try to process audio with Gemini's multimodal capabilities
      const prompt = `You are having a voice conversation with a user. ${conversationContext ? 'Previous conversation:\n' + conversationContext + '\n\n' : ''}Please listen to this audio message and respond naturally and conversationally. If you cannot understand the audio clearly, politely ask the user to speak more clearly or try again.`
      
      const audioPart = {
        inlineData: {
          data: audioData,
          mimeType: 'audio/webm'
        }
      }

      console.log(`[Voice Chat] Sending audio to Gemini...`)
      
      // Generate response with audio input
      const result = await model.generateContent([prompt, audioPart])
      const response = await result.response
      const text = response.text()
      
      console.log(`[Voice Chat] Gemini response received: ${text}`)
      
      // Generate audio response using Web Speech API (will be handled on client)
      // For a more advanced solution, you could integrate Google Text-to-Speech API here
      
      // Add to conversation history
      session.conversationHistory.push(
        {
          role: 'user',
          content: '[Audio message]',
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: text,
          timestamp: new Date()
        }
      )

      console.log(`Processed audio for session: ${sessionId}`)
      
      return Response.json({ 
        success: true, 
        transcription: 'Audio processed successfully',
        response: text,
        shouldSpeak: true // Signal client to speak the response
      })
      
    } catch (audioError) {
      console.warn('[Voice Chat] Audio processing failed, using text-only fallback:', audioError)
      
      // Fallback: Use a simple text-based interaction
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const fallbackPrompt = `You are having a voice conversation with a user. ${conversationContext ? 'Previous conversation:\n' + conversationContext + '\n\n' : ''}The user just sent an audio message, but I couldn't process the audio clearly. Please respond politely and ask them to try speaking again, perhaps more clearly or closer to their microphone. Be helpful and encouraging. Keep your response conversational and brief.`
      
      const fallbackResult = await model.generateContent(fallbackPrompt)
      const fallbackResponse = await fallbackResult.response
      const fallbackText = fallbackResponse.text()
      
      console.log(`[Voice Chat] Fallback response: ${fallbackText}`)
      
      // Add to conversation history
      session.conversationHistory.push(
        {
          role: 'user',
          content: '[Audio unclear]',
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date()
        }
      )
      
      return Response.json({ 
        success: true, 
        transcription: 'Audio unclear - please try again',
        response: fallbackText,
        shouldSpeak: true,
        warning: 'Audio processing failed, using fallback response'
      })
    }
    
  } catch (error) {
    console.error('Error sending audio:', error)
    return Response.json({ 
      error: 'Failed to process audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function endSession(sessionId: string) {
  activeSessions.delete(sessionId)
  console.log(`Ending voice session: ${sessionId}`)
  return Response.json({ success: true })
}
