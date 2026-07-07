// This file was rewritten based on Vuanh96's source code (Edited by Ersikthy: Added reusability)

/*How to reuse this: 
    - Create a handler function in the parent component: In the parent component, 
        write a function that takes a parameter (this is the URL of the image after uploading). 
        Inside this function, perform the action of saving that URL (for example, print it to the console for testing, 
        save it to the parent page's state, or call an API to save it to MongoDB).

    - Pass the function to the prop: When you call the <Upload /> tag in the return section of the parent component, 
        pass the handler function you just created to the onUploadSuccess property.

    Example: 
    import Upload from "../components/Upload";

    export default function Profile() {
        
        **Hàm nhận URL từ component Upload gửi lên
        const handleAvatarUploadSuccess = async (imageUrl) => {
            try {
                **Gọi API cập nhật avatar của User vào MongoDB
                await userApi.updateAvatar(imageUrl);
                console.log("Lưu avatar này vào bảng User:", imageUrl);
            } catch (error) {
                console.error("Lỗi cập nhật avatar");
            }
        };

        return (
            <div>
                <h2>User Profile</h2>
                Truyền hàm xử lý vào prop onUploadSucces
                <Upload onUploadSuccess={handleAvatarUploadSuccess} />
            </div>
        );
    }
*/

import Swal from "sweetalert2";
import uploadApi from "../api/uploadApi";
import { useState } from "react";

export default function Upload({onUploadSuccess}) {
    const [selectedFile, setSelectedFile] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const fileSelectedHandler = (e) => {
        const file = e.target.files[0]

        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }
    const uploadHandlerSubmit = async (e) => {
        if (!selectedFile) {
            Swal.fire({
                title: 'Error!',
                text: 'Please select a file first.',
                icon: 'warning',
                confirmButtonText: 'Done'
            });
            return;
        }

        try {
            const imagePath = await uploadApi.uploadImage(selectedFile);
            const uploadUrl = `http://localhost:5000/${imagePath}`;

            Swal.fire({
                title: 'Upload Successfully!',
                text: 'Image uploaded successfully!',
                icon: 'success',
                confirmButtonText: 'Done'
            })

            if (onUploadSuccess) {
                onUploadSuccess(uploadUrl);
            }

            setSelectedFile('');
            setPreviewUrl('');
        } catch (error) {
            console.error('Error upload', error);
            const errorMessage = error.response ? error.response.data : 'Something went wrong';
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Done'
            })
        }
    }

    return (
        <>
            <input type="file" accept="image/*" onChange={fileSelectedHandler}/>
            {previewUrl && <img src={previewUrl} />}
            <button onClick={uploadHandlerSubmit}>Upload</button>
        </>
    )
}