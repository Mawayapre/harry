'use client'


import {useState , useEffect} from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/services.module.css'
import Link from "next/link";

const Page = () => {

  const { id } = useParams();
 
  const [services , setServices] = useState([]);
  const [loading , setLoading] = useState(true)


  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/getservice/${id}`);
        const data = await res.json();
        setServices(data.services)

        if(res.ok){
          setLoading(false)
        }
        
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
        

    }
 
    fetchData()

  }, [id])


  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Services
      </div>

      <div className={styles.wrapper}>
        { loading ? (
          <div className={styles.loader}></div>
        ) : (
          <div className={styles.data}>
          { services.length > 0 ? ( services.map((service) => (
              <div  key={service._id} className={styles.card}>
              <div className={styles.title}>
              {service.name}
              </div>
              <div className={styles.price}>
              Price : {service.price}
              </div>
              <div className={styles.duration}>
              Duration : {service.duration}
              </div>
              <div className={styles.description}>
              Description : {service.description}
              </div>
              <Link href={`/book/${service._id}`}>Book Now</Link>
              </div>
          ))) : (
            <p>No services available</p>
             
          )}

          
          </div>
        ) }
      </div>
    </div>
  )
}

export default Page
