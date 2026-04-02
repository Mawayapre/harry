import connectDB from "@/db/connectDB";
import Business from "@/model/businessModel";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connectDB();

    const body = await request.json();

    const { BusinessName, description, email, phoneNumber } = body;

    if (!BusinessName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "BusinessName, email, and phoneNumber are required" },
        { status: 400 }
      );
    }

    // 4. Check if email already exists
    const existingBusiness = await Business.findOne({ email });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Business with this email already exists" },
        { status: 400 }
      );
    }

    // 5. Create business
    const newBusiness = await Business.create({
      BusinessName,
      description,
      email,
      phoneNumber
    });

    // 6. Send response
    return NextResponse.json(
      {
        message: "Business registered successfully",
        business: newBusiness
      },
      { status: 201 }
    );

  } catch (error) {
    console.log("Error creating business:", error);

    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
};