import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function UserUploads({ paintings }) {
    const navigate = useNavigate();

    const scrollRef = useRef(null);

    const handleScroll = (e) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY * 2;
        }
    };
    
    return (
        <div className="user-uploads-wrapper">
            <h2>Your Paintings</h2>
            <div className="user-uploads-img-bar">
                {paintings?.length > 0 ?
                    <div ref={scrollRef} onWheel={handleScroll}>
                        {paintings?.map(painting => (
                            <div key={painting._id}>
                                <img onClick={(
                                ) => navigate(`/gallery/${painting._id}`)} src={`http://localhost:5000${painting.image_url}`} alt="" />
                            </div>
                        ))}
                    </div>
                    :
                    <div>
                        <p>You haven't uploaded any paintings.</p>
                    </div>}
            </div>
        </div>
    )
} 