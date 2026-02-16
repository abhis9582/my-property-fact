import { NextResponse } from "next/server";
import { fetchTopPicksProject } from "@/app/_global_components/masterFunction";


export async function GET() {
  try {
    const topProject = await fetchTopPicksProject();
    return NextResponse.json({
      success: true,
      topProject,
      _meta: {
        rotationIntervalSeconds: 30,
      },
    });
  } catch (error) {
    console.error("Top picks API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch top picks",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
