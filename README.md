# ReadWithCard - AI-Powered Language Learning App

An intelligent flashcard application that transforms images into interactive learning cards using **Google Gemini AI** and **OCR technology**. Built for the **BTK AI in Education Hackathon 2025**.

## 🎯 Project Overview

ReadWithCard revolutionizes language learning by allowing users to create personalized flashcards from any text source - books, articles, signs, or handwritten notes. Simply take a photo, and our AI-powered system extracts text, analyzes words, and creates comprehensive learning cards with translations, pronunciations, and contextual examples.

## ✨ Key Features

- **📸 Smart OCR**: Advanced text extraction from images using Tesseract with optimized preprocessing
- **🤖 AI-Powered Cards**: Google Gemini analyzes words in context to create rich flashcards with translations, descriptions, and example sentences
- **💬 Interactive Chat**: Built-in AI assistant helps you practice using new words and provides grammar corrections
- **🗂️ Deck Management**: Organize flashcards into custom decks for focused study sessions
- **📊 Progress Tracking**: Monitor your learning journey with detailed statistics and streak tracking
- **📱 Offline Support**: SQLite database ensures seamless offline functionality

## 🛠️ Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Google Gemini API**: Advanced AI language processing
- **Tesseract OCR**: Text extraction from images
- **OpenCV**: Image preprocessing and enhancement

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Rapid development and deployment platform
- **SQLite**: Local database for card storage

## 🚀 Installation & Setup

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **Google Gemini API Key**
- **Tesseract OCR** installed and configured
  
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/00ec4473-56ef-4361-9300-5f0c6fbbfa69" />

## 📱 Usage

1. **Capture Text**: Take a photo of any text content using your device camera
2. **OCR Processing**: The app automatically extracts and processes text from the image
3. **Word Selection**: Choose specific words you want to learn from the extracted text
4. **AI Card Generation**: Google Gemini creates detailed flashcards with:
   - Word translations
   - Contextual descriptions
   - Pronunciation guides
   - Example sentences
5. **Study & Practice**: Review cards using spaced repetition and practice with AI chat
6. **Track Progress**: Monitor your learning streaks and improvement over time


### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ReadWithCard

# Install dependencies
npm install

# Start Expo development server
expo start
```


## 🏗️ Project Structure

```
ReadWithCard-Hackathon/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/endpoints/     # API routes
│   │   ├── services/          # Business logic
│   │   ├── models/            # Data models
│   │   ├── image_to_text/     # OCR processing
│   │   └── config/            # Configuration
│   └── requirements.txt       # Python dependencies
├── ReadWithCard/              # React Native Frontend
│   ├── components/            # React components
│   ├── screens/              # App screens
│   ├── services/             # API services
│   ├── db/                   # Database configuration
│   ├── navigator/            # Navigation setup
│   └── package.json          # Node dependencies
└── README.md
```

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing capabilities
- **Tesseract OCR** for robust text extraction
- **BTK Academy** for organizing the AI in Education Hackathon 2025
- **React Native & Expo** communities for excellent development tools

---

**Built with ❤️ for the BTK AI in Hackathon 2025**

*Transforming the way we learn languages through AI innovation*
