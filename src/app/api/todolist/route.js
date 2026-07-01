import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL);

async function getDb() {
  await client.connect();
  return client.db("vyro_task").collection("todolist");
}

// GET /api/todolist — load the current user's todolist data
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const col = await getDb();
    const doc = await col.findOne({ userId: session.user.id });

    return NextResponse.json({ data: doc ?? null });
  } catch (err) {
    console.error("[GET /api/todolist]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/todolist — save (upsert) the current user's todolist data
export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tasks, weeks, history, dayCounter, lastDateKey } = body;

    const col = await getDb();
    await col.updateOne(
      { userId: session.user.id },
      {
        $set: {
          userId: session.user.id,
          tasks,
          weeks,
          history,
          dayCounter,
          lastDateKey,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/todolist]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
