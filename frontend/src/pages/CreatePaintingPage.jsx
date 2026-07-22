import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import '../themes/CreatePaintingPage.css';

export default function CreatePaintingPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [surfaceType, setSurfaceType] = useState('Canvas');
    const [colorMedium, setColorMedium] = useState('Oil');
    const [artisticStyle, setArtisticStyle] = useState('Realism');
    const [tags, setTags] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [drafts, setDrafts] = useState([]);
    const [activeDrafts, setActiveDraftsId] = useState(null);
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const savedDrafts = localStorage.getItem('painting_drafts');
        if (savedDrafts) {
            try {
                setDrafts(JSON.parse(savedDrafts));
            } catch (error) {
                console.error('Error parsing drafts from localStorage', error);
            }
        }
    }, []);

    const handleCreateNew = () => {
        setTitle('');
        setDesc('');
        setSurfaceType('Canvas');
        setColorMedium('Oil');
        setArtisticStyle('Realism');
        setTags('');
        setFile(null);
        setPreview(null);
        setActiveDraftsId(null);
    };


    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }

    const base64ToFile = (base64String, fileName) => {
        if (!base64String) return null;

        var arr = base64String.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
    }

    const handleSelectDraft = (selectedDraft) => {
        setTitle(selectedDraft.title || '');
        setDesc(selectedDraft.description || '');
        setSurfaceType(selectedDraft.surface_type || 'Canvas');
        setColorMedium(selectedDraft.color_medium || 'Oil');
        setArtisticStyle(selectedDraft.artistic_style || 'Realism');
        setTags(selectedDraft.tags || '');
        setActiveDraftsId(selectedDraft.id);

        if (selectedDraft.image_base64) {
            setPreview(selectedDraft.image_base64)

            const restoredFile = base64ToFile(selectedDraft.image_base64, 'draft_image.png')
            setFile(restoredFile)
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const handleDeleteDraft = (e, draftId) => {
        e.stopPropagation();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this draft!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
                setDrafts(updatedDrafts);
                localStorage.setItem('painting_drafts', JSON.stringify(updatedDrafts));

                if (activeDrafts === draftId) {
                    handleCreateNew();
                }

                Swal.fire('Deleted!', 'Your draft has been deleted.', 'success');
            }
        });
    };

    useEffect(() => {
        const isFormEmpty = !title.trim() && !desc.trim() && !tags.trim() && !preview;
        if (isFormEmpty) return;

        const delayDebounceFn = setTimeout(async () => {

            let base64String = null;
            if (file) {
                try {
                    base64String = preview.startsWith('data: image') ? preview : await fileToBase64(file)
                } catch (error) {
                    console.error('Cannot save draft images as base64!', error)
                    Swal.fire('Error', 'Something went wrong', 'error')
                }
            }

            let updatedDrafts = [];
            if (activeDrafts) {
                updatedDrafts = drafts.map((draft) => {
                    if (draft.id === activeDrafts) {
                        return {
                            ...draft,
                            title,
                            description: desc,
                            surface_type: surfaceType,
                            color_medium: colorMedium,
                            artistic_style: artisticStyle,
                            tags,
                            image_base64: base64String,
                            updatedAt: Date.now()
                        };
                    }
                    return draft;
                });
            } else {
                const newId = Date.now().toString();
                const newDraft = {
                    id: newId,
                    title,
                    description: desc,
                    surface_type: surfaceType,
                    color_medium: colorMedium,
                    artistic_style: artisticStyle,
                    tags,
                    image_base64: base64String,
                    updatedAt: Date.now()
                };

                setActiveDraftsId(newId);
                updatedDrafts = [newDraft, ...drafts];
            }

            setDrafts(updatedDrafts);
            localStorage.setItem('painting_drafts', JSON.stringify(updatedDrafts));

        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [title, desc, surfaceType, colorMedium, artisticStyle, tags, file, preview, activeDrafts]);

    const analyzeImage = async () => {
        if (!file) {
            Swal.fire('Error', 'Please select an image first!', 'error');
            return;
        }

        setIsAnalyzing(true);
        try {
            const token = Cookies.get('token');
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(
                'http://localhost:5000/api/upload/analyze',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const data = response.data;
            console.log(data)
            if (data.title) setTitle(data.title);
            if (data.description) setDesc(data.description);
            if (data.tags) setTags(data.tags);
            if (data.surface_type) setSurfaceType(data.surface_type);
            if (data.color_medium) setColorMedium(data.color_medium);
            if (data.artistic_style) setArtisticStyle(data.artistic_style);

            Swal.fire('Done!', 'Image details generated successfully!', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Could not analyze image.', 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            console.log(URL.createObjectURL(selectedFile))
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];

            if (droppedFile.type.startsWith('image/')) {
                setFile(droppedFile);
                setPreview(URL.createObjectURL(droppedFile));
            } else {
                Swal.fire('Error', 'Please drop an image file.', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            Swal.fire('Error', 'Please select an image to upload.', 'error');
            return;
        }

        setLoading(true);
        try {
            const token = Cookies.get('token');

            const formData = new FormData();
            formData.append('image', file);
            formData.append('title', title);
            formData.append('description', desc);
            formData.append('surface_type', surfaceType);
            formData.append('color_medium', colorMedium);
            formData.append('artistic_style', artisticStyle);
            formData.append('tags', tags);

            const response = await axios.post(
                'http://localhost:5000/api/upload',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                if (activeDrafts) {
                    const remainingDrafts = drafts.filter(d => d.id !== activeDrafts);
                    setDrafts(remainingDrafts);
                    localStorage.setItem('painting_drafts', JSON.stringify(remainingDrafts));
                }

                Swal.fire('Success', 'Your painting is waiting for admin approval!', 'success');
                navigate('/profile');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Something went wrong!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            <aside className="drafts-sidebar">
                <div className="drafts-sidebar-header">
                    <h3>Drafts</h3>
                    <span className="drafts-count">{drafts.length}</span>
                </div>
                <button type="button" className="btn-create-new" onClick={handleCreateNew}>
                    + Create New
                </button>
                <div className="drafts-list">
                    {drafts.length === 0 ? (
                        <div className="drafts-empty">No drafts saved yet.</div>
                    ) : (
                        drafts.map((draft) => (
                            <div
                                key={draft.id}
                                className={`draft-card ${activeDrafts === draft.id ? 'active' : ''}`}
                                onClick={() => handleSelectDraft(draft)}
                                style={{ position: 'relative' }}
                            >
                                <div className="draft-card-info">
                                    <h4>{draft.title || 'Untitled Draft'}</h4>
                                    <span>{draft.description ? draft.description.substring(0, 25) + '...' : 'No description'}</span>
                                </div>

                                <button
                                    type="button"
                                    className="btn-delete-draft"
                                    onClick={(e) => handleDeleteDraft(e, draft.id)}
                                    title="Delete draft"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            <div className="create-painting-container" style={{ flex: 1, margin: 0 }}>
                <h1>Create New Painting</h1>

                <form onSubmit={handleSubmit} className="pinterest-form-layout">
                    <div className="pinterest-left-col">
                        <label className={`file-upload-section ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{ cursor: 'pointer' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            {preview ? (
                                <>
                                    <div className="preview-item">
                                        <img src={preview} alt="Preview" />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-remove-preview"
                                        onClick={() => { setFile(null); setPreview(null); }}
                                    >
                                        ✕ Remove Image
                                    </button>
                                </>
                            ) : (
                                <div className="upload-area-wrapper" >

                                    <div className="upload-icon-circle">
                                        <i className="bi bi-arrow-up-circle" style={{ fontSize: '32px' }}></i>
                                    </div>

                                    <div className="upload-instructions">
                                        Choose a file or drag and drop it here
                                    </div>
                                    <br />
                                    <div className="upload-recommendation">
                                        We recommend using medium quality .jpg files less than 10 MB.
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="pinterest-right-col">
                        <div className="form-field">
                            <label>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Enter painting title"
                            />
                        </div>

                        <div className="form-field">
                            <label>Description</label>
                            <textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Describe your masterpiece"
                            ></textarea>
                        </div>

                        <div className="attributes-row">
                            <div className="form-field">
                                <label>Surface Type</label>
                                <select value={surfaceType} onChange={(e) => setSurfaceType(e.target.value)}>
                                    <option value="Canvas">Canvas</option>
                                    <option value="Paper">Paper</option>
                                    <option value="Wood">Wood</option>
                                    <option value="Digital">Digital</option>
                                    <option value="Glass">Glass</option>
                                    <option value="Fabric">Fabric / Textile</option>
                                    <option value="Metal">Metal</option>
                                    <option value="Ceramic">Ceramic / Clay</option>
                                    <option value="Stone">Stone / Rock</option>
                                    <option value="Wall">Wall / Mural</option>
                                    <option value="Leather">Leather</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Color Medium</label>
                                <select value={colorMedium} onChange={(e) => setColorMedium(e.target.value)}>
                                    <option value="Oil">Oil</option>
                                    <option value="Watercolor">Watercolor</option>
                                    <option value="Acrylic">Acrylic</option>
                                    <option value="Pixels">Pixels</option>
                                    <option value="Inks">Inks</option>
                                    <option value="Charcoal">Charcoal / Graphite</option>
                                    <option value="Pastel">Pastel</option>
                                    <option value="Spray Paint">Spray Paint</option>
                                    <option value="Encaustic">Encaustic</option>
                                    <option value="Pencils">Colored Pencils / Crayon</option>
                                    <option value="Mixed Media">Mixed Media</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Artistic Style</label>
                                <select value={artisticStyle} onChange={(e) => setArtisticStyle(e.target.value)}>
                                    <option value="Realism">Realism</option>
                                    <option value="Abstract">Abstract</option>
                                    <option value="Impressionism">Impressionism</option>
                                    <option value="Modern">Modern</option>
                                    <option value="Surrealism">Surrealism</option>
                                    <option value="Anime / Manga">Anime / Manga</option>
                                    <option value="Pixel Art">Pixel Art</option>
                                    <option value="Concept Art">Concept Art</option>
                                    <option value="Expressionism">Expressionism</option>
                                    <option value="Art Nouveau">Art Nouveau / Art Deco</option>
                                    <option value="Folk Art">Traditional / Folk Art</option>
                                    <option value="Dark Art">Gothic / Dark Art</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="nature, classic, colorful"
                            />
                        </div>

                        <div className="form-field">
                            <label>Generate Image Details</label>
                            <button
                                className="btn-generate-details"
                                type="button"
                                onClick={analyzeImage}
                                disabled={isAnalyzing || !file}
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Generate Details'}
                            </button>
                        </div>

                        <button type="submit" disabled={loading} className="btn-submit-pinterest" disabled={isAnalyzing || !file}>
                            {loading ? 'Uploading Masterpiece...' : 'Submit Painting'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}