# STFU: The Audio-First Social Storytelling Platform

## 🎙️ Unleash Your Voice. Listen to Others.

Welcome to **STFU** (Short-form, Thoughtful, Fully Unfiltered – *yeah, we went there* 😉), an innovative, mobile-first social application built entirely around the power of the human voice.

This project showcases a robust, modern mobile application development stack, designed for performance, scalability, and an intuitive user experience.

---

## 🛠️ Tech Stack & Architecture


* **Frontend:**
    * **React Native:** For cross-platform mobile development.
    * **Expo:** Streamlining the development workflow with a powerful SDK.
    * **TailwindCSS:** For utility-first CSS styling, ensuring a consistent and maintainable UI.
* **Backend (Chosen for Flexibility & Scalability):**
    * **Supabase:** (Alternative/Hybrid) PostgreSQL Database, Authentication, Storage, Edge Functions.
    * *The architecture is designed to be largely agnostic between these solutions where possible, demonstrating flexibility.*

---

## 🚀 Getting Started (For Developers & Curious Minds)

Want to peek under the hood or even get this bad boy running locally? Here's how to get started. Fair warning: setting up a full social app always has a few "fun" steps! 😉

### Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (LTS recommended)
* npm or Yarn
* Expo CLI (`npm install -g expo-cli`)

### Installation Steps

1.  **Clone the repository:**
2.  **Install dependencies:**
3.  **Environment Variables:** Check them in the .env.local
4.  **Database Schema & Functions:** For security and brevity in this public README, the full database schema (tables, RLS policies, functions, triggers) is not directly included here. However, I can provide it upon request or during a deeper discussion about the project architecture. It includes tables for users, posts, reactions, replies, categories, and more, along with necessary row-level security (RLS) and custom functions for optimized operations.

1.  **Run the application:**
    ```bash
    npx expo start
    ```
    This will open a new browser window with the Expo Dev Tools. You can then run the app on an iOS simulator, Android emulator, or on your physical device using the Expo Go app.

---
