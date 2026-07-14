import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import userApi from "../api/userApi"
import paintingApi from "../api/paintingApi"

export default function CollectionPage() {
    const BASE_URL = 'http://localhost:5000';
    const navigate = useNavigate();
    const { collection_id } = useParams();
    const [collection, setCollection] = useState(null);
    const [allPaintings, setAllPaintings] = useState([]);
    const [displayedPaintings, setDisplayedPaintings] = useState([]);

    const token = Cookies.get('token');

    function handleViewPainting(painting_id) {
        navigate(`/gallery/${painting_id}`)
    }

    const queryParams = new URLSearchParams(location.search);
    const searchKeyword = queryParams.get('search') || "";

    useEffect(() => {
        const fetchAndFilterCollection = async () => {
            try {
                const data = await userApi.fetchUserCollection(token, collection_id);

                if (data && data.userCollection) {
                    setCollection(data.userCollection);

                    const fullPaintings = await Promise.all(
                        data.userCollection.paintings.map(async (p) => {
                            const res = await paintingApi.getPainting(p._id);
                            return res.painting || res;
                        })
                    );

                    const masterList = fullPaintings.filter(p => p !== null);

                    if (!searchKeyword.trim()) {
                        setDisplayedPaintings(masterList);
                    } else {
                        const lowerKeyword = searchKeyword.toLowerCase();
                        const filtered = masterList.filter(painting => {
                            
                            const matchesTitle = painting.title?.toLowerCase().includes(lowerKeyword);
                            const matchesArtist = painting.artist?.toLowerCase().includes(lowerKeyword);

                            const matchesTags = painting.tags?.some(tag =>
                                tag?.toLowerCase().includes(lowerKeyword)
                            ) || false;

                            return matchesTitle || matchesArtist || matchesStyle || matchesTags;
                        });

                        setDisplayedPaintings(filtered);
                    }
                }
            } catch (error) {
                console.error("Error during data retrieval:", error);
            }
        };

        if (token && collection_id) {
            fetchAndFilterCollection();
        }
    }, [collection_id, token, location.search]);

    return (
        <div className='collection-wrapper'>
            {collection ?
                <div className="collection-info">
                    <h3 className="collection-info-name">{collection.name}</h3>
                    <p className="collection-info-counts">{collection?.paintings?.length || 0} saved paintings</p>
                    <hr />
                    <div className="gallery-grid">
                        {displayedPaintings.map((painting) => (
                            <div key={painting._id} className="gallery-card">
                                <div className="gallery-image-frame">
                                    <img
                                        src={`${BASE_URL}${painting.image_url}`}
                                        alt={painting.title}
                                        className="gallery-display-img"
                                    />

                                    <div className="gallery-card-overlay">
                                        <span className="gallery-artist-tag">{painting.artist}</span>
                                        <div className="gallery-view-action">
                                            <button onClick={() => handleViewPainting(painting._id)}>
                                                <img className="open-url-icon" src="/open_url.png" alt=""></img>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="gallery-card-details">
                                    <h4 className="gallery-card-title">{painting.title}</h4>
                                    {painting.artistic_style && (
                                        <span className="gallery-style-badge">{painting.artistic_style}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                :
                <div className="collection-fail">
                    <h3 className="collection-fail-message">The collection is no longer available or failed to load.</h3>
                </div>
            }
        </div>
    )
}