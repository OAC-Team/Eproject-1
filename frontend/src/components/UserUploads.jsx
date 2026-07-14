import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function UserUploads({ paintings, user }) {
    const navigate = useNavigate();

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheelScroll = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();

                container.scrollLeft += e.deltaY * 1.2;
            }
        };

        container.addEventListener('wheel', handleWheelScroll, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheelScroll);
        };
    }, [paintings]);

    function handleViewPainting(painting_id) {
        // console.log(`Navigating to ${painting_id}`)
        navigate(`/gallery/${painting_id}`, {
            state: {
                userData: user
            }
        })
    }

    return (
        <div className="user-uploads-wrapper">
            <h2>Your Paintings</h2>
            <div className="user-uploads-img-bar">
                {paintings?.length > 0 ?
                    <div ref={scrollContainerRef}>
                        {paintings?.map(painting => (
                            <div key={painting._id}>
                                <img onClick={() => handleViewPainting(painting._id)} src={`http://localhost:5000${painting.image_url}`} alt="" />
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