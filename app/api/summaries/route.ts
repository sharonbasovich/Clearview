import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("journal_app");

    const summaries = await db.collection("summaries").find({}).toArray();

    return NextResponse.json(summaries);
  } catch (error) {
    console.error("Error getting summary:", error);
    return NextResponse.json({ error: "Failed to get summary" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("journal_app");
    const {summary, begin, end} = await request.json();
    const result = await db.collection("summaries").insertOne({
      summary: summary,
      beginDate: begin,
      endDate: end
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error posting summary:", error);
    return NextResponse.json(
      { error: "Failed to post summary" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("journal_app");
    const { id, newSummary, newBegin, newEnd} = await request.json();
    const result = await db
      .collection("summaries")
      .updateOne({ _id: id }, { $set: { summary: newSummary, begin: newBegin, end: newEnd} });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error posting summary:", error);
    return NextResponse.json(
      { error: "Failed to post summary" },
      { status: 500 }
    );
  }
}
