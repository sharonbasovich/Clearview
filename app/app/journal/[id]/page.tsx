"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Edit,
  ArrowLeft,
  Volume2,
  Pause,
  Square,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EntryPage() {
  const [entry, setEntry] = useState<any>(null);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`/api/journal-entries/${id}`);
        if (!response.ok) throw new Error("Failed to fetch entry");
        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error("Error fetching entry:", error);
      }
    };

    fetchEntry();
  }, [id]);

  const startReading = () => {
    if (!entry) return;

    // Check if speech synthesis is supported
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    // Create the text to be read
    const textToRead = `Title: ${entry.title}. Entry: ${entry.content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Configure speech settings
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Handle speech end
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    // Handle speech error (but don't show alert for cancellation)
    utterance.onerror = (event) => {
      // Only show error if it's not a cancellation
      if (event.error !== "canceled" && event.error !== "interrupted") {
        alert("An error occurred while reading the text.");
      }
      setIsReading(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    setIsReading(true);
    setIsPaused(false);
    speechSynthesis.speak(utterance);
  };

  const pauseReading = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeReading = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };

  if (!entry) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back and Edit buttons */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/app/journal">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Entries
            </Button>
          </Link>
          <div className="flex gap-2">
            {!isReading ? (
              <Button
                onClick={startReading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Read Aloud
              </Button>
            ) : (
              <>
                <Button
                  onClick={isPaused ? resumeReading : pauseReading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                <Button
                  onClick={stopReading}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
              </>
            )}
            <Link href={`/app/journal/${id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Entry
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{entry.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content with preserved formatting */}
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {entry.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Metadata */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
                {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                  <p>
                    Last modified: {new Date(entry.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
