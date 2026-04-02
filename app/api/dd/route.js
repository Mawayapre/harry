import connectDB from "@/db/connectDB";
import Business from "@/model/businessModel";
import Service from "@/model/serviceModel";
import { NextResponse } from "next/server";



export async function GET(request){
    try {
        await connectDB();
        const business = await Business.find();
        
        return NextResponse.json(business)
    } catch (error) {
        console.log(error)
        return NextResponse.json({error : "Failed to fetch businesses"}, {status : 500})
    }

}