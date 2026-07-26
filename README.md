# Only Art Collection

An interactive digital art gallery platform built to showcase, organize, and discover artwork with integrated AI-assisted features, color palette analysis, and personalized recommendations.

---

## About the Project
**Only Art Collection** is a dedicated web repository designed for digital artists and collectors. Unlike standard image-sharing websites, this application classifies and indexes art by surface types, color mediums, and dominant hex color codes. Users can organize their portfolios into collections or public/private boards, interact with a context-aware AI Art Assistant, and browse customized feeds matching their artistic preferences.

---

## Key Features
* **AI-Assisted Artwork Uploading:** Instantly analyze uploaded images via the **Groq Vision API** (`qwen/qwen3.6-27b`) to auto-fill title suggestions, stylistic tags, description captions, artistic styles, mediums, and surfaces.
* **Dominant Color Palette Extraction:** Employs `node-vibrant` and `color-namer` to identify major hex codes and label them with descriptive color names.
* **Pinterest-Style Boards:** Create and manage custom boards to pin artwork, including control over public and private visibility settings.
* **Context-Aware AI Chatbot:** A persistent chat assistant that fetches platform statistics and reads the metadata of the artwork you are currently viewing to provide detailed answers.
* **Personalized Recommendation Feed:** Recommends approved paintings based on the user's favorites profile (matching styles and tags).
* **Admin Dashboard:** Includes analytics charts (Recharts), real-time user activity logs, pending review queues, and administrative tools (password reset, account suspension).

---

## Tech Stack
### Frontend
* **Core:** React v19, React DOM v19 (built with Vite)
* **Routing:** React Router DOM v7
* **Styling:** Vanilla CSS, Bootstrap v5, React Bootstrap, Bootstrap Icons
* **Utilities:** Recharts, SweetAlert2, js-cookie, React Markdown
* **OAuth:** `@react-oauth/google`

### Backend
* **Runtime & Framework:** Node.js (CommonJS), Express.js (Express v5)
* **Database:** MongoDB, Mongoose ORM
* **Authentication:** JSON Web Tokens (JWT), `bcryptjs`, `google-auth-library`
* **File Storage:** Multer, `multer-storage-cloudinary` (Cloudinary API)
* **AI Engine:** Groq SDK (LLM integration)
* **Image Processing:** `node-vibrant`, `color-namer`

---

## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
* **Node.js:** Ensure Node.js (v18.x or higher) is installed on your local machine.
* **MongoDB:** A running MongoDB instance (local or MongoDB Atlas Cloud).
* **Third-Party API Accounts:**
  * [Cloudinary](https://cloudinary.com/) (For storing uploaded images)
  * [Groq Cloud](https://console.groq.com/) (For running LLM models)
  * [Google Developer Console](https://console.developers.google.com/) (For Google OAuth Client ID)

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sky20plus-max/Eproject-1.git
   cd Eproject-1
   ```

2. **Run the workspace setup:**
   This command installs dependencies for the root, frontend, and backend packages concurrently:
   ```bash
   npm run setup
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following configuration:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_KEY=your_jwt_secret_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   GROQ_API_KEY=your_groq_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

---

## Usage

1. **Start the development servers:**
   Run the following command in the project root to start both the backend server and Vite frontend server concurrently:
   ```bash
   npm run dev
   ```

2. **Access the application:**
   * Open your browser and navigate to `http://localhost:5173` to browse the React frontend.
   * The backend API server will run at `http://localhost:5000`.

---

## Contributing
Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License
Distributed under the ISC License. See `package.json` for details.

---

## Contact
* **Project Repository:** [https://github.com/sky20plus-max/Eproject-1](https://github.com/sky20plus-max/Eproject-1)
* **Support Inquiries:** Submit contact requests directly using the support form page `/contact` in the application.
