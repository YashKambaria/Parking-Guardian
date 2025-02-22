import React from "react";
import HomeCard from "./HomeCard";
import chatting_image from "./assets/chatting.svg"
import calling_image from "./assets/calling.svg"
import location_image from "./assets/location.svg"

export default function Home({ darkMode }) {
    let card_icon = ['message', 'call', 'location']
    let card_head1 = "Messaging & Location-Based Alerts";
    let card_head2 = "Automated Call Alerts";
    let card_head3 = "Google Maps Link in SMS Alerts";
    let card_content1 = [
        "The Messaging & Location-Based Alert System enhances user engagement by sending real-time notifications, complaint updates, and location details for better issue resolution.",
        "✅ Real-Time Alerts: Users receive instant notifications when their complaint is updated or resolved.",
        "✅ Location-Based Messages: Complaint alerts include the exact location of the reported vehicle for better accuracy.",
    ]
    let card_content2 = [
        "✅ Instant Voice Alerts: When a complaint is submitted, the vehicle owner receives an automated call with details about the issue.",
        "✅ Complaint Information in Call: The call includes the vehicle plate number, location, and reason for the complaint.",
        "✅ High Priority Cases: Calls are triggered for urgent complaints (e.g., blocking emergency exits, no response to SMS)."
    ]
    let card_content3 = [
        "✅ Location-Based Alerts: When a complaint is submitted, the system generates a Google Maps link with the vehicle’s precise location.",
        "✅ Direct Navigation: Vehicle owners can click the link in the SMS to open Google Maps and navigate directly to their vehicle.",
        "✅ Enhanced Clarity: Instead of just text-based complaints, the location link helps owners identify where their vehicle is parked in relation to the issue."
    ]

    return (
        <>
            <div
            className={`container mx-auto mt-18 space-y-8 p-15 pt-10 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
                <HomeCard 
                setImageLeft = {true}
                darkMode = { darkMode }
                card_image = { chatting_image }
                card_content = { card_content1 }
                card_head = { card_head1 }
                card_icon = { card_icon[0] } />
                <HomeCard
                setImageLeft = {false}
                darkMode = { darkMode }
                card_image = { calling_image }
                card_content = { card_content2 }
                card_head = { card_head2 }
                card_icon = { card_icon[1] } />
                <HomeCard
                setImageLeft = {true}
                darkMode = { darkMode }
                card_image = { location_image }
                card_content = { card_content3 }
                card_head = { card_head3 }
                card_icon = { card_icon[2] } />
            </div>
        </>
    )
}