import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("journal_app");

    const entry = await db
      .collection("journal_entries")
      .findOne({ _id: new ObjectId(params.id) });

    await client.close();

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error getting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to get entry" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("journal_app");

    const entry = await request.json();

    const result = await db
      .collection("journal_entries")
      .updateOne(
        { _id: new ObjectId(params.id) },
        {
          $set: {
            title: entry.title,
            content: entry.content,
            tags: entry.tags,
            updatedAt: entry.updatedAt,
          },
        }
      );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}