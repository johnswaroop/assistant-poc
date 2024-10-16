import { NextRequest, NextResponse } from "next/server";
import transcribeAudio from "../../../app/transribeAudio"; // Adjust the path as per your file structure

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get the base64URL
    const { base64URL } = await req.json();

    if (!base64URL) {
      return NextResponse.json(
        { error: "No base64URL provided." },
        { status: 400 }
      );
    }

    // Call the transcribeAudio function with the base64 URL
    const transcription = await transcribeAudio(base64URL);

    // Return the transcription as a JSON response
    return NextResponse.json({ transcription }, { status: 200 });
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json(
      { error: "Error during transcription" },
      { status: 500 }
    );
  }
}
