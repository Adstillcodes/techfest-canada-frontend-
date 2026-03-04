"use client"

import React, { useState, useEffect } from "react"

/** * Note: To fix resolution errors in the preview environment, we use ESM imports.
 * In your local project, you should run: npm install @sanity/client
 * and then you can use: import { createClient } from "@sanity/client"
 */
import { createClient } from "https://esm.sh/@sanity/client"

// Sanity Client Configuration
const client = createClient({
  projectId: "021qtoci", // Replace with your actual Sanity Project ID from sanity.io/manage
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-03",
})

/**
 * EventSchedule Component
 * This component fetches event data from Sanity CMS and organizes it by day.
 */
export default function EventSchedule() {
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState(1) // Defaults to Day 1
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events from Sanity, ordered by their start time
        const query = `*[_type == "event"] | order(time asc)`
        const data = await client.fetch(query)
        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching events from Sanity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Strictly filter the events based on the active tab (Day 1, 2, or 3)
  // We use Number() to handle potential string/number mismatches in the CMS data
  const filteredEvents = events.filter((event) => Number(event.day) === activeTab)

  if (loading) {
    return (
      <div className="schedule-card animate-pulse" style={{ marginTop: '40px', padding: '28px', border: '1px solid var(--border-main)', borderRadius: '18px' }}>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="schedule-card" style={{ marginTop: '40px' }}>
      <h3 style={{ marginBottom: '20px', fontFamily: 'Orbitron', fontSize: '1.5rem' }}>Event Schedule</h3>
      
      {/* Day Selector Tabs */}
      <div className="schedule-tabs" style={{ 
        display: 'flex', 
        gap: '20px', 
        borderBottom: '1px solid var(--border-main)', 
        marginBottom: '25px' 
      }}>
        {[1, 2, 3].map((day) => (
          <button
            key={day}
            onClick={() => setActiveTab(day)}
            className={activeTab === day ? "active" : ""}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 0',
              cursor: 'pointer',
              color: activeTab === day ? 'var(--brand-purple)' : 'var(--text-muted)',
              borderBottom: activeTab === day ? '3px solid var(--brand-purple)' : '3px solid transparent',
              fontFamily: 'Orbitron',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: '0.3s',
              outline: 'none'
            }}
          >
            DAY {day}
          </button>
        ))}
      </div>

      {/* Timeline of Events */}
      <div className="timeline" style={{ position: 'relative', paddingLeft: '25px' }}>
        {/* Vertical Line Connector */}
        <div style={{
          position: 'absolute',
          left: '7px',
          top: '0',
          bottom: '0',
          width: '2px',
          backgroundColor: 'var(--border-main)'
        }} />

        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, idx) => (
            <div key={event._id || idx} className="timeline-item" style={{ marginBottom: '30px', position: 'relative' }}>
              {/* Timeline Indicator Dot */}
              <div style={{
                position: 'absolute',
                left: '-23px',
                top: '6px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-orange)',
                border: '3px solid var(--bg-main)',
                zIndex: 2
              }} />
              
              <div className="timeline-content">
                <span style={{ 
                  color: 'var(--brand-purple)', 
                  fontWeight: 800, 
                  fontSize: '0.8rem',
                  display: 'block',
                  marginBottom: '4px',
                  fontFamily: 'Orbitron'
                }}>
                  {event.time}
                </span>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>{event.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {event.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              No sessions have been added to the schedule for Day {activeTab} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}