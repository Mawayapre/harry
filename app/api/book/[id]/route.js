import connectDB from  '@/db/connectDB'
import { NextResponse } from 'next/server'
import  Business  from '@/model/businessModel';
import Service from '@/model/serviceModel';
import Availability from '@/model/availabilityModel';
import { generateSlots } from '@/lib/booking';
import Booking from '@/model/bookingModel';

export async function GET(request, {params}){

    const param = await params;
    const serviceId = param.id;
    const {searchParams} = new URL(request.url)
    const date = searchParams.get('date')


    await connectDB();

    try {
        if(!date) return NextResponse.json({
            message: 'date is required'
        }, {status : 400})

        const ExistingService = await Service.findById(serviceId)

        if(!ExistingService) return NextResponse.json({
            message : 'Service not found'
        }, {status : 404})

        const availability = await Availability.findOne({businessId : ExistingService.business})


        const selectedDate  = new Date(date);
        const dayOfWeek = selectedDate.getDay();

        const isWorkingDay = availability.workingDays.includes(dayOfWeek);

        if(!isWorkingDay) return NextResponse.json({
            message : 'Service is not available on this day'
        }, {status : 400})

        const isOffDate = availability.offDates.includes(selectedDate);

        if(isOffDate) return NextResponse.json({
            message : 'Service is not available on this date'
        }, {status : 400})


        const allSlots = generateSlots(availability)

        const bookings = await Booking.find({
            businessId : ExistingService.business,
            date
        })

        const bookedSlots = bookings.map(booking => booking.slot);

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        return NextResponse.json({
            message : 'Success',
            availability,
            allSlots,
            availableSlots
        })
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message : 'Something went wrong',
            error
        })
    }
}