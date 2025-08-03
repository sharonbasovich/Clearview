"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Fab,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Mic, MicOff, VolumeUp, SmartToy, Person } from "@mui/icons-material";
import { Navigation } from "@/components/ui/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface ConversationTurn {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  status: "speaking" | "processing" | "complete";
}

export default function VoiceChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [conversationTurns, setConversationTurns] = useState<
    ConversationTurn[]
  >([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check authentication
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        router.push("/auth");
      } else {
        // Start voice session once user is authenticated
        startVoiceSession();
      }
    };

    // Check if speech synthesis is supported
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSpeechSupported(true);
      speechSynthesisRef.current = window.speechSynthesis;

      // Load voices if not already loaded
      const loadVoices = () => {
        const voices = speechSynthesisRef.current?.getVoices() || [];
        if (voices.length === 0) {
          // Voices not loaded yet, try again
          setTimeout(loadVoices, 100);
        }
      };

      // Some browsers load voices asynchronously
      if (speechSynthesisRef.current.getVoices().length === 0) {
        speechSynthesisRef.current.addEventListener(
          "voiceschanged",
          loadVoices,
          { once: true }
        );
      }
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
      // Cleanup on unmount
      if (sessionId) {
        endVoiceSession();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const startVoiceSession = async () => {
    try {
      const newSessionId = Date.now().toString();
      console.log(
        `[Voice Chat Frontend] Starting session with ID: ${newSessionId}`
      );

      const response = await fetch("/api/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", sessionId: newSessionId }),
      });

      const data = await response.json();
      console.log(`[Voice Chat Frontend] Session start response:`, data);

      if (data.success) {
        setSessionId(newSessionId);
        setError(null);
        console.log(
          `[Voice Chat Frontend] Session started successfully: ${newSessionId}`
        );
      } else {
        console.error(`[Voice Chat Frontend] Session start failed:`, data);
        setError("Failed to start voice session");
      }
    } catch (error) {
      console.error(
        "[Voice Chat Frontend] Error starting voice session:",
        error
      );
      setError("Failed to connect to voice service");
    }
  };

  const endVoiceSession = async () => {
    if (!sessionId) return;

    try {
      await fetch("/api/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", sessionId }),
      });
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const startListening = async () => {
    if (!sessionId) {
      setError("No active session");
      return;
    }

    // Stop any ongoing speech synthesis when user starts talking
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsPlaying(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Set up audio context for visualization
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        processAudioInput(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      // Add user turn
      const userTurn: ConversationTurn = {
        id: Date.now().toString(),
        type: "user",
        content: "Speaking...",
        timestamp: new Date(),
        status: "speaking",
      };
      setConversationTurns((prev) => [...prev, userTurn]);

      mediaRecorderRef.current.start(100);
      setIsListening(true);
      setError(null);

      // Start audio level monitoring
      monitorAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Failed to access microphone");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setAudioLevel(0);

      // Update user turn status
      setConversationTurns((prev) =>
        prev.map((turn, index) =>
          index === prev.length - 1 && turn.type === "user"
            ? { ...turn, status: "processing", content: "Processing..." }
            : turn
        )
      );
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateLevel = () => {
      if (!isListening || !analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);

      requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  const processAudioInput = async (audioBlob: Blob) => {
    if (!sessionId) {
      console.error("[Voice Chat Frontend] No session ID available");
      setError("No active session");
      return;
    }

    setIsProcessing(true);
    console.log(
      `[Voice Chat Frontend] Processing audio for session: ${sessionId}`
    );

    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(",")[1];
        console.log(
          `[Voice Chat Frontend] Audio converted to base64, length: ${base64Audio.length}`
        );

        const response = await fetch("/api/voice-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_audio",
            sessionId,
            audioData: base64Audio,
          }),
        });

        const data = await response.json();
        console.log(`[Voice Chat Frontend] Audio processing response:`, data);

        if (data.success) {
          // Update user turn with transcription
          setConversationTurns((prev) =>
            prev.map((turn, index) =>
              index === prev.length - 1 && turn.type === "user"
                ? {
                    ...turn,
                    status: "complete",
                    content: data.transcription || "Voice message",
                  }
                : turn
            )
          );

          // Add assistant turn
          const assistantTurn: ConversationTurn = {
            id: Date.now().toString(),
            type: "assistant",
            content: data.response,
            timestamp: new Date(),
            status: "complete",
          };
          setConversationTurns((prev) => [...prev, assistantTurn]);

          // If there's audio response or shouldSpeak flag, play it
          if (data.shouldSpeak && data.response) {
            console.log(
              `[Voice Chat Frontend] Speaking response: ${data.response}`
            );
            speakResponse(data.response);
          } else if (data.audioResponse) {
            console.log(`[Voice Chat Frontend] Playing audio response`);
            playAudioResponse(data.audioResponse);
          }
        } else {
          console.error(`[Voice Chat Frontend] Audio processing failed:`, data);
          setError("Failed to get AI response");
        }

        setIsProcessing(false);
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("[Voice Chat Frontend] Error processing audio:", error);
      setError("Failed to process audio");
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    console.log(`[Voice Chat Frontend] Attempting to speak: "${text}"`);
    console.log(
      `[Voice Chat Frontend] Speech synthesis supported: ${isSpeechSupported}`
    );

    if (!speechSynthesisRef.current || !isSpeechSupported) {
      console.warn("[Voice Chat Frontend] Speech synthesis not supported");
      setError("Speech synthesis not available in this browser");
      return;
    }

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings for more natural conversation
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to use a more natural voice if available
    const voices = speechSynthesisRef.current.getVoices();
    console.log(`[Voice Chat Frontend] Available voices: ${voices.length}`);

    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes("Natural") ||
        voice.name.includes("Enhanced") ||
        voice.name.includes("Neural") ||
        (voice.lang.startsWith("en") && voice.localService)
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log(`[Voice Chat Frontend] Using voice: ${preferredVoice.name}`);
    } else {
      console.log(`[Voice Chat Frontend] Using default voice`);
    }

    // Set up event handlers
    utterance.onstart = () => {
      console.log(`[Voice Chat Frontend] Speech started`);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      console.log(`[Voice Chat Frontend] Speech ended`);
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.error("[Voice Chat Frontend] Speech synthesis error:", event);
      setIsPlaying(false);
      setError("Failed to speak response");
    };

    // Speak the response
    console.log(`[Voice Chat Frontend] Starting speech synthesis`);
    speechSynthesisRef.current.speak(utterance);
  };

  const playAudioResponse = (base64Audio: string) => {
    try {
      const audioData = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioData);
      currentAudioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setError("Failed to play audio response");
      };

      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setError("Failed to play audio response");
    }
  };

  const getMicrophoneColor = () => {
    if (isListening) {
      const intensity = Math.max(0.3, audioLevel);
      return `rgba(244, 67, 54, ${intensity})`;
    }
    return sessionId ? "#4caf50" : "#9e9e9e";
  };

  const getMicrophoneScale = () => {
    if (isListening && audioLevel > 0.1) {
      return 1 + audioLevel * 0.3;
    }
    return 1;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <LinearProgress sx={{ width: "200px" }} />
        <Typography>Loading voice chat...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "grey.50" }}>
      <div
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
      >
        <Navigation />
      </div>

      <Container maxWidth="md" sx={{ pt: 10, pb: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Voice Chat with Gemini
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Have a natural voice conversation with AI
          </Typography>

          {/* Status Indicators */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Chip
              label={sessionId ? "Connected" : "Connecting..."}
              color={sessionId ? "success" : "warning"}
              variant="outlined"
            />
            {!isSpeechSupported && (
              <Chip
                label="Voice responses unavailable"
                color="warning"
                variant="outlined"
                size="small"
              />
            )}
            {isProcessing && (
              <Chip label="Processing..." color="info" variant="outlined" />
            )}
            {isPlaying && (
              <Chip
                label="AI Speaking"
                color="secondary"
                variant="outlined"
                icon={<VolumeUp />}
              />
            )}
          </Stack>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Conversation History */}
        <Paper elevation={2} sx={{ mb: 4, minHeight: "40vh", p: 3 }}>
          {conversationTurns.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                textAlign: "center",
              }}
            >
              <Box>
                <SmartToy sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Start your voice conversation!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Press and hold the microphone to speak with Gemini AI
                </Typography>
                {isSpeechSupported && (
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ mt: 1, display: "block" }}
                  >
                    🎤 Voice-to-voice conversation enabled
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Stack spacing={3}>
              {conversationTurns.map((turn) => (
                <Box
                  key={turn.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    flexDirection: turn.type === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor:
                        turn.type === "user"
                          ? "primary.main"
                          : "secondary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {turn.type === "user" ? (
                      <Person sx={{ color: "white", fontSize: 24 }} />
                    ) : (
                      <SmartToy sx={{ color: "white", fontSize: 24 }} />
                    )}
                  </Box>

                  <Card
                    elevation={1}
                    sx={{
                      minWidth: 200,
                      maxWidth: "70%",
                      backgroundColor:
                        turn.type === "user" ? "primary.light" : "grey.100",
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Typography
                        variant="body1"
                        color={
                          turn.type === "user"
                            ? "primary.contrastText"
                            : "text.primary"
                        }
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {turn.content}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {turn.status === "speaking" && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                              animation: "pulse 1.5s infinite",
                              "@keyframes pulse": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.5 },
                                "100%": { opacity: 1 },
                              },
                            }}
                          />
                        )}
                        {turn.status === "processing" && (
                          <LinearProgress sx={{ width: 40, height: 2 }} />
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              turn.type === "user"
                                ? "primary.contrastText"
                                : "text.secondary",
                            opacity: 0.7,
                          }}
                        >
                          {turn.status === "complete"
                            ? turn.timestamp.toLocaleTimeString()
                            : turn.status}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Voice Controls */}
        <Box sx={{ textAlign: "center", position: "relative" }}>
          {/* Audio Visualization Ring */}
          {isListening && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: `4px solid ${getMicrophoneColor()}`,
                opacity: 0.6 + audioLevel * 0.4,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "translate(-50%, -50%) scale(1)" },
                  "50%": { transform: "translate(-50%, -50%) scale(1.05)" },
                  "100%": { transform: "translate(-50%, -50%) scale(1)" },
                },
              }}
            />
          )}

          {/* Main Microphone Button */}
          <Fab
            size="large"
            sx={{
              width: 100,
              height: 100,
              backgroundColor: getMicrophoneColor(),
              transform: `scale(${getMicrophoneScale()})`,
              transition: "all 0.1s ease-in-out",
              "&:hover": {
                backgroundColor: getMicrophoneColor(),
                transform: `scale(${getMicrophoneScale() * 1.05})`,
              },
            }}
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            disabled={!sessionId || isProcessing || isPlaying}
          >
            {isListening ? (
              <MicOff sx={{ fontSize: 36, color: "white" }} />
            ) : (
              <Mic sx={{ fontSize: 36, color: "white" }} />
            )}
          </Fab>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
            {isListening
              ? "Release to send your message"
              : isProcessing
              ? "Processing your message..."
              : isPlaying
              ? "AI is speaking... (press mic to interrupt)"
              : isSpeechSupported
              ? "Press and hold to speak - AI will respond with voice"
              : "Press and hold to speak"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
