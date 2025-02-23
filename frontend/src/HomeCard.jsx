import React from "react";

export default function HomeCard({ setImageLeft, darkMode, card_image, card_content = [], card_head, card_icon }) {
    
    let card_icon_style = {
        marginRight: '10px',
        fontSize: '1.5rem',
    };

    console.log(card_content);

    let icons = {
        message: (<i className="fa-regular fa-message fa-bounce" style={card_icon_style}></i>),
        call: (<i className="fa-solid fa-phone-volume fa-shake" style={card_icon_style}></i>),
        location: (<i className="fa-solid fa-location-dot fa-bounce" style={card_icon_style}></i>),
        mail: (<i className="fa-regular fa-envelope fa-beat" style={card_icon_style}></i>),
    };

    return setImageLeft ? (
        <div
            className={`flex flex-col md:flex-row items-center p-6 justify-center rounded-lg shadow-lg transition-colors duration-300 ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
            }`}
        >
            {card_image && (
                <img
                    src={card_image}
                    alt="Card Image"
                    className="h-40 w-auto rounded-lg object-cover"
                />
            )}
            <div className="p-6">
                <h2 className="text-2xl font-bold">
                    {card_icon && icons[card_icon]} {/* ✅ Fix: Correctly access the icon */}
                    {card_head ? card_head : "Card Head"}
                </h2>
                <p className="mt-2">
                    {card_content.length > 0 ? (
                        card_content.map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))
                    ) : (
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit..."
                    )}
                </p>
            </div>
        </div>
    ) : (
        <div
            className={`flex flex-col md:flex-row-reverse items-center justify-center p-6 rounded-lg shadow-lg transition-colors duration-300 ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
            }`}
        >
            {card_image && (
                <img
                    src={card_image}
                    alt="Card Image"
                    className="h-40 w-auto rounded-lg object-cover"
                />
            )}
            <div className="p-6">
                <h2 className="text-2xl font-bold">
                    {card_icon && icons[card_icon]} {/* ✅ Fix applied here too */}
                    {card_head ? card_head : "📍 Messaging & Location-Based Alerts"}
                </h2>
                <p className="mt-2">
                    {card_content.length > 0 ? (
                        card_content.map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))
                    ) : (
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit..."
                    )}
                </p>
            </div>
        </div>
    );
}
