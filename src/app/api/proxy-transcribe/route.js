// app/api/transcribe/route.js (for JavaScript)
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { base64URL } = await req.json(); // Parse the incoming request body

    // Make the axios request to the external API
    const res = await axios.post("http://3.87.178.84:3001/api/transcribe", {
      base64URL,
    });

    // Return the response from the external API to the client
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error in /api/transcribe:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
