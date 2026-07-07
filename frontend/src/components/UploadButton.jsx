<<<<<<< HEAD
import React,{useState} from "react";
import { uploadImageApi } from "../api/uploadApi";

export default function UploadButton({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (event) => {
    if (event.target.files[0]) setSelectedFile(event.target.files[0]);
};  
  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
        const result = await uploadImageApi(selectedFile);
        alert("Image uploaded successfully!");
        console.log('Upload result:', result);
    } catch (error) {
        alert("Failed to upload image.");
    }finally {
        setIsUploading(false);
    }
};
return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Image"}
        </button>
    </div>
);
}
=======
import React, { useState } from "react";
import uploadApi from "../api/uploadApi";

export default function UploadButton({ onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const handleFileChange = (event) => {
        if (event.target.files[0]) setSelectedFile(event.target.files[0]);
    };
    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            const result = await uploadApi.uploadImage(selectedFile)
            alert("Image uploaded successfully!");
            console.log('Upload result:', result);
        } catch (error) {
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Image"}
            </button>
        </div>
    );
}
>>>>>>> origin/main
