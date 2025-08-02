# MindMirror System Design Document

## 1. Introduction

This document outlines the system design for MindMirror, a journaling application that leverages AI to help users reflect on their thoughts. The application utilizes a Next.js frontend, a Firebase backend with Python functions, and the Google Gemini SDK for AI-powered analysis, including multi-agent and multimodel capabilities for speech-to-text and text-to-speech. A key feature is the AI-generated user interface, which adapts based on user interaction and AI insights.

## 2. Architecture

MindMirror follows a serverless architecture pattern, primarily utilizing Firebase services.

```
mermaid
graph LR
    A[User] --> B(MindMirror Frontend);
    B --> C(Firebase Authentication);
    B --> D(Firebase Firestore);
    B --> E(Firebase Storage);
    B --> F(Firebase Cloud Functions);
    F --> G(Google Gemini SDK);
    G --> H(Speech-to-Text Model);
    G --> I(Text-to-Speech Model);
    G --> J(AI Reasoning Agents);
    F --> D;
    F --> E;
```
*   **Frontend (Next.js):** A single-page application (SPA) built with Next.js for a fast and responsive user experience. It handles user interaction, data presentation, and communication with the backend. The UI is dynamically generated and adjusted based on responses from the AI reasoning agents.
*   **Backend (Firebase & Python Functions):**
    *   **Firebase Authentication:** Manages user registration and login.
    *   **Firebase Firestore:** A NoSQL cloud database used to store user data, journal entries, and AI-generated insights.
    *   **Firebase Storage:** Stores audio recordings from the speech-to-text feature.
    *   **Firebase Cloud Functions (Python):** Serverless functions that handle backend logic, including:
        *   Receiving journal entries (text or audio).
        *   Processing audio input using the Speech-to-Text model.
        *   Interacting with the Google Gemini SDK for AI analysis.
        *   Storing processed data and AI insights in Firestore.
        *   Generating text-to-speech responses.
        *   Providing data to the frontend for UI generation and updates.
*   **AI (Google Gemini SDK):**
    *   **Speech-to-Text Model:** Transcribes user's spoken journal entries.
    *   **Text-to-Speech Model:** Generates audio responses from AI insights and feedback.
    *   **Multi-agent System:** Different AI agents specialized in tasks like:
        *   Analyzing journal content for patterns and insights.
        *   Identifying cognitive distortions.
        *   Generating reflective prompts.
        *   Providing feedback on the dynamic UI generation.
    *   **Multimodel Capabilities:** Leverages Gemini's ability to process and generate various data types (text, audio).

## 3. Data Flow

1.  **User Input:** A user interacts with the frontend to create a new journal entry (text or speech).
2.  **Authentication:** The frontend ensures the user is authenticated via Firebase Authentication.
3.  **Data Submission:**
    *   **Text Entry:** The frontend sends the text directly to a Firebase Cloud Function.
    *   **Speech Entry:** The frontend records audio and uploads it to Firebase Storage. A trigger on Firebase Storage then invokes a Firebase Cloud Function.
4.  **Backend Processing (Cloud Functions):**
    *   If speech input, the Cloud Function calls the Speech-to-Text model via the Gemini SDK to transcribe the audio.
    *   The Cloud Function sends the text content (either directly from text entry or from transcription) to the multi-agent AI system via the Gemini SDK.
    *   AI agents analyze the text, generate insights, identify patterns, and formulate prompts.
    *   Based on the AI analysis, the Cloud Function may request the Text-to-Speech model to generate an audio response.
    *   The Cloud Function stores the original entry, transcribed text (if applicable), AI insights, and generated audio URLs in Firebase Firestore.
5.  **Frontend Update:**
    *   The frontend listens for changes in Firestore related to the user's entries.
    *   Upon receiving new data (AI insights, prompts, audio URLs), the frontend updates the UI dynamically based on the AI's guidance for layout and content presentation.
6.  **AI-Driven UI Generation:** The AI agents provide feedback and instructions to the frontend on how to structure and present the journal entry and the associated insights, leading to a personalized and adaptive user interface.

## 4. Components

*   **MindMirror Frontend:**
    *   Journal Entry Component (Text and Speech Input)
    *   Dynamic UI Rendering Component (interprets AI guidance for layout)
    *   Journal History View
    *   Authentication UI
    *   Audio Playback Component
*   **Firebase Services:**
    *   Firebase Authentication
    *   Firebase Firestore
    *   Firebase Storage
*   **Firebase Cloud Functions (Python):**
    *   `processJournalEntry` (handles text and triggers transcription for audio)
    *   `transcribeAudio` (triggered by Storage upload)
    *   `analyzeEntryWithGemini` (interacts with AI agents)
    *   `generateAudioResponse` (calls Text-to-Speech model)
*   **Google Gemini SDK:**
    *   Integration libraries for Python Cloud Functions
    *   Interfaces to the Speech-to-Text, Text-to-Speech, and multi-agent AI models.

## 5. Future Enhancements

*   Sentiment analysis and mood tracking over time.
*   Integration with other health and wellness platforms.
*   More sophisticated multi-agent interactions for deeper analysis.
*   Enhanced personalization of the AI-generated UI.
*   Offline journaling capabilities with later synchronization.