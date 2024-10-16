"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, PhoneOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

import { summarizeTranscription } from "@/app/summarize";
import sendMail from "@/app/sendEmail";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import axios from "axios";

export function VoiceAssistantComponent() {
  const [email, setEmail] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { load, play, duration, isLoading } = useGlobalAudioPlayer();

  useEffect(() => {
    load("/greeting.mp3");
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSubmitted(true);
  };

  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();

  const toggleListening = () => {
    if (!isListening) {
      setTranscript("Listening to your request...");
      startRecording();
      setIsListening(true);
    } else {
      setTranscript("Processing your request...");
      stopRecording();
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (recordingBlob) {
      console.log(recordingBlob);

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Audio = (event.target.result as string).split(",")[1];
          try {
            const res = await axios.post("/api/transcribe", {
              base64URL: base64Audio,
            });

            const transcription = res.data.transcription;
            console.log("Transcription result:", transcription);

            const summary = await summarizeTranscription(
              JSON.stringify(transcription)
            );
            console.log("Summary:", summary);
            // Handle the summary result here
            sendMail(email, summary);
          } catch (error) {
            console.error("Processing error:", error);
          }
        }
      };
      reader.readAsDataURL(recordingBlob);
    }
  }, [recordingBlob]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="  p-8 rounded-2xl bg-white shadow-lg border border-gray-200 "
      >
        <AnimatePresence mode="wait">
          {!isEmailSubmitted ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleEmailSubmit}
              className="w-[350px] "
            >
              <h2 className="text-3xl font-bold text-black text-center">
                Welcome
              </h2>
              <div className="space-y-2 mt-4">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white text-black placeholder-gray-400 border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 mt-4"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="voice-assistant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-[350px] h-fit"
            >
              <h2 className="text-3xl font-bold text-black text-center">
                Voice Assistant
              </h2>
              {!isLoading && (
                <div
                  onClick={() => {
                    //toggleListening()
                    if (!isListening) {
                      play();
                      setTimeout(() => {
                        toggleListening();
                      }, duration * 1000);
                    } else {
                      toggleListening();
                    }
                  }}
                  className="flex flex-col items-center w-full mt-6"
                >
                  <Button
                    className={`w-24 h-24 rounded-full transition-all ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {isListening ? (
                      <PhoneOff className="h-12 w-12 text-white" />
                    ) : (
                      <PhoneCall className="h-12 w-12 text-white" />
                    )}
                  </Button>
                  <p className="text-black text-center mt-6">
                    {isListening
                      ? "Tap to end request"
                      : "Tap to start request"}
                  </p>
                </div>
              )}
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <p className="text-black text-center">{transcript}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="absolute opacity-0">
        <AudioRecorder
          onRecordingComplete={(blob: Blob) => {
            return blob;
          }}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          downloadFileExtension="webm"
        />
      </div>
    </div>
  );
}
