import connectDB from '@/db/connectDB';
import Business from '@/model/businessModel';
import Service from '@/model/serviceModel';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const param = await params;
        const businessId = param.id;
        const business = await Business.findById(businessId);
        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }
        const services = await Service.find({ business: businessId });
        return NextResponse.json({ services });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}