"use server";
import fs from "fs";
import path from "path";
import os from "os";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

// Function to convert base64 URL to a temporary audio file
const base64ToTempFile = async (base64URL: string) => {
  // Extracting base64 data from the URL
  const base64Data = base64URL.split(";base64,").pop();

  // Creating a temporary file path
  const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.wav`);

  // Decoding and writing the base64 data to a temporary file
  await fs.promises.writeFile(tempFilePath, `${base64Data}`, {
    encoding: "base64",
  });

  return tempFilePath;
};

// Function to perform transcription
const transcribeAudio = async (base64URL: string) => {
  // Converting base64 URL to a temporary file
  const tempFilePath = await base64ToTempFile(base64URL);

  try {
    // Running the transcription
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
    });

    // Outputting the result
    console.log("Transcription:", transcription);

    // Optionally, delete the temporary file after transcription
    fs.promises.unlink(tempFilePath);
    return transcription;
  } catch (error) {
    console.error("Error during transcription:", error);
  }
};

export default transcribeAudio;
