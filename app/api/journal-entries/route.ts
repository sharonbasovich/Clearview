import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("journal_app");

    const entry = await db.collection("journal_entries").find({}).toArray();

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error getting journal entry:", error);
    return NextResponse.json({ error: "Failed to get entry" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("journal_app");
    
    // Fix: Destructure the entry object first
    const { entry } = await request.json();
    
    const result = await db.collection("journal_entries").insertOne({
      title: entry.title,
      content: entry.content,  // Note: changed from editorContent to content to match the client
      tags: entry.tags,
      createdAt: entry.createdAt,
    });
    
    await client.close(); // Don't forget to close the connection
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error posting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to post entry" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("journal_app");
    const { id, newEntry } = await request.json();
    const result = await db
      .collection("journal_entries")
      .updateOne({ _id: new ObjectId(id) }, { $set: { entries: newEntry } });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error posting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to post entry" },
      { status: 500 }
    );
  }
}
