import { NextResponse } from "next/server";
import {
  generateAIResponse,
  sessions,
} from "@/app/_global_components/chatbotLogic";

const CHAT_STATE_COOKIE = "mpf_chat_state";

function safeParseCookieState(rawValue) {
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

function createCookiePayload(sessionId, sessionState) {
  const safeState = {
    step: sessionState?.step || "WELCOME",
    flags: sessionState?.flags || null,
    data: {
      type: sessionState?.data?.type || null,
      city: sessionState?.data?.city || null,
      budget: sessionState?.data?.budget || null,
    },
  };

  return JSON.stringify({ sessionId, state: safeState });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Session ID and message are required" },
        { status: 400 },
      );
    }

    // Rehydrate minimal chat state on stateless/live instances.
    const parsedCookie = safeParseCookieState(
      request.cookies.get(CHAT_STATE_COOKIE)?.value,
    );
    if (
      parsedCookie?.sessionId === sessionId &&
      parsedCookie?.state &&
      !sessions[sessionId]
    ) {
      sessions[sessionId] = parsedCookie.state;
    }

    const response = await generateAIResponse(message, sessionId);
    const nextResponse = NextResponse.json(response);

    // Persist minimal state needed for the next request.
    if (sessions[sessionId]) {
      nextResponse.cookies.set(CHAT_STATE_COOKIE, createCookiePayload(sessionId, sessions[sessionId]), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 6, // 6 hours
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        reply: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
