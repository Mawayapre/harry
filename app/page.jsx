'use client'

import { useState, useEffect } from "react";
import styles from '@/styles/home.module.css'
import Link from "next/link";

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/businesses');

        if (!res.ok) {
          throw new Error('Failed to fetch businesses');
        }

        const data = await res.json();
        setBusinesses(data || []);

        console.log(data)

      } catch (error) {
        console.log("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loader}>
        
        </div>
      ) : (
        <div className={styles.wrapper}>
          {businesses.length > 0 ? (
            businesses.map((business) => (
              <div className={styles.card} key={business._id}>
                <h2>{business.BusinessName}</h2>
                <p>{business.description}</p>

                <Link href={`/business/${business._id}`}>View More</Link>
              </div>
            ))
          ) : (
            <p>No businesses found</p>
          )}
        </div>
      )}
    </div>
  );
}