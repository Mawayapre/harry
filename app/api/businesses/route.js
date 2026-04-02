import connectDB from "@/db/connectDB";
import Business from "@/model/businessModel";
import Service from "@/model/serviceModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    console.log("Connected to database");

    const businesses = await Business.find();

    return NextResponse.json(businesses);
  } catch (error) {
    console.log("Error fetching businesses:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch businesses",
        details: error.message
      },
      { status: 500 }
    );
  }
}