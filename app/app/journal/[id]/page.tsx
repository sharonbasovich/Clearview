"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EntryPage() {
  const [entry, setEntry] = useState<any>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`/api/journal-entries/${id}`);
        if (!response.ok) throw new Error('Failed to fetch entry');
        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error('Error fetching entry:', error);
      }
    };

    fetchEntry();
  }, [id]);

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
          <Link href={`/app/journal/${id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Entry
            </Button>
          </Link>
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
                  <p>Last modified: {new Date(entry.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}