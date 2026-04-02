export function timeTominutes(time){
    const parts = time.split(':');
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);


    return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes){
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0")


    return `${h}:${m}`; 
}


export function generateSlots(avail){
    const slots = [];


    const start = timeTominutes(avail.start);
    const end = timeTominutes(avail.end);
    const breakStart = timeTominutes(avail.break.start);
    const breakEnd = timeTominutes(avail.break.end);


    for(let time = start; time + avail.slotDuration <= end; time += avail.slotDuration){

        if(time >= breakStart && time < breakEnd){
            continue;
        }

        slots.push(minutesToTime(time));
    }

    return slots;
}
