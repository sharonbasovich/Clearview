import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("journal_app");

    const entry = await db.collection("insights").find({}).toArray();

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error getting insights:", error);
    return NextResponse.json({ error: "Failed to get insights" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("journal_app");
    const {insightType, insightTitle, insightDescription} = await request.json();
    const result = await db.collection("insights").insertOne({
      type: insightType,
      title: insightTitle,
      description: insightDescription,
      createdAt: new Date()
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error posting insights:", error);
    return NextResponse.json(
      { error: "Failed to post insights" },
      { status: 500 }
    );
  }
}