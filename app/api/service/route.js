import mongoose from 'mongoose';
import Business from '@/model/businessModel';
import Service from '@/model/serviceModel';
import connectDB from '@/db/connectDB';
import {NextResponse} from 'next/server';



export async function POST(request){
    await connectDB();
    try {

        const body = await request.json();
        const { businessId, name, price, duration, description } = body;

        const existingBusiness = await Business.findById(businessId);
        if (!existingBusiness) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        const newService = await Service.create({
            business: businessId,
            name,
            price,
            duration,
            description
        });

        return NextResponse.json({
            message: "Service created successfully",
            service: newService
        }, { status: 201 });
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: error.message || "Failed to create service"
        })
    }
}