# LMS - Learning Management System

A robust and modern Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js). This platform enables instructors to create and manage courses while providing students with an intuitive interface to learn, track progress, and interact with course content.

## Features

*   **User Authentication**: Secure signup and login for students and instructors (JWT-based).
*   **Course Management**: Instructors can create, update, and manage course content, including media uploads.
*   **Interactive Learning**: Video playback, progress tracking, and course curriculum viewing.
*   **Student Dashboard**: Personalized dashboard for students to view enrolled courses and progress.
*   **Payment Integration**: Secure payment processing via PayPal.
*   **Responsive Design**: Built with Tailwind CSS and Radix UI for a seamless experience across devices.
*   **Security**: Implements best practices including rate limiting, data sanitization, and secure headers.

## Tech Stack

### Client (Frontend)
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Radix UI, Framer Motion
*   **State Management & Routing**: React Router DOM
*   **Utilities**: Axios, Lucide React (Icons)

### Server (Backend)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: JSON Web Token (JWT), Bcryptjs
*   **File Storage**: Cloudinary (via Multer)
*   **Payments**: PayPal REST SDK

## Getting Started

### Prerequisites
*   Node.js (v14+ recommended)
*   MongoDB (Local or Atlas)
*   Cloudinary Account (for media storage)
*   PayPal Developer Account (for payments)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd LMS
    ```

2.  **Server Setup:**
    Navigate to the server directory and install dependencies:
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_CLIENT_SECRET=your_paypal_client_secret
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Client Setup:**
    Open a new terminal, navigate to the client directory, and install dependencies:
    ```bash
    cd client
    npm install
    ```
    Create a `.env` file in the `client` directory (typically for API keys or Base URLs):
    ```env
    VITE_BASE_URL=http://localhost:5000
    ```
    Start the development server:
    ```bash
    npm run dev
    ```

4.  **Access the Application:**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
LMS/
├── client/         # Frontend React application
│   ├── src/        # Source code (Components, Pages, etc.)
│   └── ...
├── server/         # Backend Node.js/Express application
│   ├── models/     # Database models
│   ├── routes/     # API routes
│   └── ...
└── README.md       # Project documentation
```

## License
This project is licensed under the ISC License.
