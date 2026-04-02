export const businesses = [
    {
      id: "1",
      name: "Scofield Barbershop",
      description: "A simple demo business for learning how booking systems work.",
      services: [
        {
          id: "s1",
          name: "Haircut",
          duration: 30
        },
        {
          id: "s2",
          name: "Shaving",
          duration: 20
        },
        {
          id: "s3",
          name: "Haircut + Beard",
          duration: 60
        }
      ]
    }
  ];
  
  export const availability = {
    "1": {
      workingDays: [1, 2, 3, 4, 5],
      start: "09:00",
      end: "17:00",
      break: {
        start: "12:00",
        end: "13:00"
      },
      slotDuration: 30,
      offDates: []
    }
  };
  
  export let bookings = [];