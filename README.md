# ✨ Glow Bio Builder

**Glow Bio Builder** is a premium, highly customizable digital card and bio builder designed for professionals and creators. It allows users to create stunning, glassmorphism-styled digital business cards with rich media support, including Instagram-style stories, social links, and real-time previews.

![Glow Bio Builder Preview](public/og-image.png)

## 🚀 Key Features

### 🎨 Visual & Design
*   **Glassmorphism UI**: A modern, sleek interface with blur effects, gradients, and animations.
*   **Real-Time Builder**: See changes instantly as you edit your profile.
*   **Custom Themes**: Choose from verified color pellets and background animations (Particles, Gradient Mesh).
*   **Responsive**: 100% Mobile-optimized design that looks like a native app.

### 📸 Stories & Media (New!)
*   **Instagram-Style Stories**: Upload photos and videos that vanish (or stay) on your profile.
*   **Immersive Viewer**: 100% Full-screen, borderless story viewer with tap navigation.
*   **Video Support**: Auto-playing vertical videos with blurred backgrounds for landscape media.
*   **Supabase Storage**: Robust media handling for high-quality uploads.

### 🔗 Connectivity
*   **Smart Social Links**: Add links to Instagram, LinkedIn, TikTok, YouTube, and more with auto-detected icons.
*   **Contact Actions**: "Save Contact", "Email Me", and "Call Now" buttons for instant networking.
*   **QR Code Generation**: Every profile gets a unique QR code for easy sharing.

### 🛠 Tech Stack
*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
*   **Backend**: Supabase (PostgreSQL, Auth, Storage)
*   **Deployment**: Ready for Vercel/Netlify

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Supabase Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/glow-bio-builder.git
    cd glow-bio-builder
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📜 License
This project is open-source and available under the MIT License.


