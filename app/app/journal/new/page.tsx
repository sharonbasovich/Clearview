"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Save, ArrowLeft, Smile, Meh, Frown, Heart, X } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";

const moodOptions = [
  { value: 1, label: "Very Sad", icon: Frown, color: "text-red-500" },
  { value: 2, label: "Sad", icon: Frown, color: "text-orange-500" },
  { value: 3, label: "Neutral", icon: Meh, color: "text-yellow-500" },
  { value: 4, label: "Happy", icon: Smile, color: "text-green-500" },
  { value: 5, label: "Very Happy", icon: Smile, color: "text-emerald-500" },
];

export default function NewEntryPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState([3]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [gratitude, setGratitude] = useState("");

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

  const currentMood = moodOptions.find((option) => option.value === mood[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/app/journal">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              New Journal Entry
            </h1>
            <p className="text-gray-600 mt-1">
              Capture your thoughts and feelings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Entry Title</CardTitle>
                <CardDescription>
                  Give your entry a meaningful title
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="What's on your mind today?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Your Thoughts</CardTitle>
                <CardDescription>
                  Write freely about your day, feelings, or experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Dear journal..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] text-base leading-relaxed"
                />
              </CardContent>
            </Card>

            {/* Gratitude */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Gratitude
                </CardTitle>
                <CardDescription>
                  What are you grateful for today?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="I'm grateful for..."
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>How are you feeling?</CardTitle>
                <CardDescription>Rate your overall mood today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {currentMood && (
                    <div className="flex flex-col items-center gap-2">
                      <currentMood.icon
                        className={`w-12 h-12 ${currentMood.color}`}
                      />
                      <span className="font-medium">{currentMood.label}</span>
                    </div>
                  )}
                </div>
                <Slider
                  value={mood}
                  onValueChange={setMood}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Very Sad</span>
                  <span>Very Happy</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to categorize your entry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

            {/* Save Button */}
            <Card>
              <CardContent className="pt-6">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
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
      </div>
    </div>
  );
}
