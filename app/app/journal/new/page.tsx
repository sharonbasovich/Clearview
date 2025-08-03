"use client";

import type React from "react";

// Extend Window interface for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  ArrowLeft,
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Mic,
  MicOff,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";
import { useRouter } from "next/navigation";

export default function NewEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [journalEntries, setJournalEntries] = useState<any[]>();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  // AI suggestion state and typing debounce
  const [suggestion, setSuggestion] = useState<string>("");
  const [suggestionStatus, setSuggestionStatus] = useState<
    "idle" | "waiting" | "fetching"
  >("idle");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [suggestionPos, setSuggestionPos] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/journal-entries`);
      const data = await result.json();
      const temp: any[] = [];

      data.forEach((entry: any) => {
        temp.push({
          _id: entry._id,
          entries: entry.entries,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
        });
      });
      setJournalEntries(temp);
    };
    fetchData();
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };
  const saveEntry = async () => {
    try {
      const entry = {
        title: title,
        content: editorContent,
        tags: tags,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/journal-entries`, {
        method: "POST",
        body: JSON.stringify({ entry }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save entry");
      }

      const result = await response.json();

      // Redirect to the specific journal entry page
      if (result.insertedId) {
        router.push(`/app/journal/${result.insertedId}`);
      } else {
        // Fallback to journal list if no ID is returned
        router.push("/app/journal");
      }
    } catch (err) {
      console.error("Error submitting entry:", err);
      // You might want to show an error message to the user here
    }
  };
  // Rich text editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Dear journal...",
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Update the content state to trigger re-render
      const html = editor.getHTML();
      setEditorContent(html);

      // Clear current suggestion when user is typing
      setSuggestion("");
      setSuggestionStatus("idle");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const plainText = editor.getText().trim();
      if (plainText.split(/\s+/).length >= 3) {
        // capture caret coords for positioning suggestion later
        const { from } = editor.state.selection;
        const coords = editor.view.coordsAtPos(from);
        const containerRect =
          editorContainerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setSuggestionPos({
            top: coords.bottom - containerRect.top,
            left: 4,
          });
        }
        setSuggestionStatus("waiting");
        // Trigger suggestion after 2s pause
        typingTimeoutRef.current = setTimeout(async () => {
          setSuggestionStatus("fetching");
          try {
            const res = await fetch("/api/ai-suggestion", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: plainText,
                title: title, // Include title for better context
              }),
            });
            const data = await res.json();
            if (data.suggestion) {
              setSuggestion(data.suggestion);
            }
            setSuggestionStatus("idle");
          } catch (err) {
            console.error("Failed to fetch AI suggestion", err);
          }
        }, 2000); // 2 second pause
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none min-h-[400px] p-4",
      },
    },
  });

  // Initialize speech recognition after editor is available
  useEffect(() => {
    if (!editor) return;

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && editor) {
          // Insert the final transcript into the editor
          const currentContent = editor.getHTML();
          const newContent =
            currentContent.replace(/<p><\/p>$/, "") +
            (currentContent.endsWith("</p>")
              ? ` ${finalTranscript}`
              : `<p>${finalTranscript}</p>`);
          editor.commands.setContent(newContent);
          setEditorContent(newContent);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          alert(
            "Microphone access was denied. Please allow microphone access and try again."
          );
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [editor]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Editor toolbar commands
  const formatCommands = [
    {
      label: "Bold",
      icon: <Bold className="w-4 h-4" />,
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: () => editor?.isActive("bold"),
    },
    {
      label: "Italic",
      icon: <Italic className="w-4 h-4" />,
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: () => editor?.isActive("italic"),
    },
    {
      label: "Quote",
      icon: <Quote className="w-4 h-4" />,
      action: () => editor?.chain().focus().toggleBlockquote().run(),
      isActive: () => editor?.isActive("blockquote"),
    },
    {
      label: "Code",
      icon: <Code className="w-4 h-4" />,
      action: () => editor?.chain().focus().toggleCode().run(),
      isActive: () => editor?.isActive("code"),
    },
    {
      label: "Bullet List",
      icon: <List className="w-4 h-4" />,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: () => editor?.isActive("bulletList"),
    },
    {
      label: "Numbered List",
      icon: <ListOrdered className="w-4 h-4" />,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: () => editor?.isActive("orderedList"),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3aa0f7]/10 via-[#8b59fb]/10 to-[#5b5bfb]/10">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <style jsx global>{`
          .ProseMirror {
            outline: none !important;
            padding: 16px;
            min-height: 400px;
            height: auto;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .ProseMirror:focus {
            outline: none !important;
          }
          .ProseMirror p.is-editor-empty:first-of-type::before {
            color: #6b7280;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
          .ProseMirror h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
          }
          .ProseMirror h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
          }
          .ProseMirror h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
          }
          .ProseMirror blockquote {
            border-left: 3px solid #e5e7eb;
            margin: 1rem 0;
            padding-left: 1rem;
            font-style: italic;
            color: #6b7280;
          }
          .ProseMirror code {
            background-color: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: monospace;
          }
          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .ProseMirror li {
            margin: 0.25rem 0;
          }
        `}</style>
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/app/journal">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            New Journal Entry
          </h1>
          <p className="text-gray-600 mt-1">
            Capture your thoughts and feelings
          </p>
        </div>

        <div className="space-y-6">
          {/* Title and Tags Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Title */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Entry Title</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <Input
                    placeholder="What's on your mind today?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Your Thoughts</CardTitle>
              <CardDescription>
                Write freely about your day and we'll help you reflect on it.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Editor Toolbar */}
              <div className="flex items-center gap-1 p-3 border-b bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                >
                  <Redo className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                {formatCommands.map((command) => (
                  <Button
                    key={command.label}
                    variant={command.isActive() ? "default" : "ghost"}
                    size="sm"
                    onClick={command.action}
                    title={command.label}
                  >
                    {command.icon}
                  </Button>
                ))}

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleVoiceInput}
                  title={isListening ? "Stop voice input" : "Start voice input"}
                  className={isListening ? "animate-pulse" : ""}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                  {isListening ? "Stop Transcribing" : "Start Transcribing"}
                </Button>

                {editor && (
                  <div className="ml-auto text-xs text-gray-500 flex items-center gap-4">
                    <span>
                      {editor.storage.characterCount.characters()} characters
                    </span>
                  </div>
                )}
              </div>{" "}
              {/* end toolbar */}
              {/* Editor Content */}
              <div className="min-h-[400px] relative" ref={editorContainerRef}>
                <EditorContent editor={editor} />
                {(suggestion || suggestionStatus !== "idle") && (
                  <div
                    className="absolute text-gray-400 italic pointer-events-none"
                    style={{
                      top: suggestionPos.top + 6,
                      left: suggestionPos.left + 12,
                    }}
                  >
                    {suggestion ||
                      (suggestionStatus === "waiting"
                        ? "Pause to get suggestion"
                        : "Getting suggestion...")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card className="w-full">
            <CardContent className="pt-6">
              <Button
                className="w-full bg-[#3aa0f7] hover:bg-[#3aa0f7]/80"
                onClick={saveEntry}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Your entries are private and secure
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
