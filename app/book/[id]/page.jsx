'use client'

import { useState, useEffect} from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DayPicker } from 'react-day-picker'
import styles from '@/styles/cale.module.css'
import { ToastContainer, toast } from 'react-toastify';

const Page = () => {
  const params = useParams();
  const id = params.id;

  const [date, setDate] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [name , setName] = useState("")
  const [businessId, setBusinessId] = useState(null)
  const [click, setClicked] = useState(false)

  useEffect(() => {
      if (!date) return 
  
      const fetchData = async () => {
          setLoading(true)
          try {
              const res = await fetch(`/api/book/${id}?date=${date.toISOString().split('T')[0]}`)
              const data = await res.json()
              if (res.ok) {
                  setSlots(data.availableSlots || [])
                  setBusinessId(data.availability.businessId || null)
              }
          } catch (error) {
              console.log(error)
          } finally {
              setLoading(false)
              setSelectedSlot(null)
          }
      }
  
      fetchData()
  
  }, [id, date, click])

  const bookAppointment = async () => {
    if (!date || !selectedSlot || !name) {
      alert("Please select a date, slot and enter your name before booking.");
      return;
    }

    try {

      setClicked(true)

      const res = await fetch('/api/bookings',{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          serviceId: id,
          date: date.toISOString().split('T')[0],
          slot: selectedSlot,
          customerName: name,
          businessId: businessId,
        }) 
      })

      console.log(res)

      if(res.ok){
        toast('Appointment booked succefully', { type: "success" });
      } else {
        const errorData = await res.json();
        toast(errorData.error || 'Failed to book appointment', { type: "error" });
      }

       
    } catch (error) {
      console.log("Booking error:", error);
      alert("Failed to book appointment. Please try again.");
    } finally{
      setClicked(false)
      setName("")
    }
  }
 

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.title}>
        Pick Date
      </div>
      <div className={styles.calendar}>
      <DayPicker
          mode="single"
          disabled={{ before: new Date() }}
          className={styles.daypicker}
          selected={date}
          onSelect={setDate}
      />
      </div>

      <div className={styles.slots}>
        {loading ? (
          <div className={styles.loader}></div>
        ) : (
          slots.length > 0 ? (slots.map((slot) => (
            <div
             key={slot} 
             className={`${styles.slot} ${selectedSlot === slot ? styles.selectedSlot : ""}`}
             onClick={() => setSelectedSlot(slot)}
             >
              {slot}
            </div>
          ))) : (<p>No available slots for the selected date.</p>
          )
        )}

      </div>

      <div className={styles.name}>
        <input type="text" placeholder='Enter Your Name' 
        onChange={(e) => setName(e.target.value)}
        value={name}
        />
      </div>

      <div className={styles.values}>
        <p>Date: {date ? date.toDateString() : "Not selected"}</p>
        <p>Slot: {selectedSlot || "Not selected"}</p>
        <p>Name: {name || "Not entered"}</p>
      </div>

      <button onClick={bookAppointment} className={styles.button}>
        {click ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  )
}

export default Page