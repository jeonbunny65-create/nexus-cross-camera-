# Cross-Camera Vehicle Intelligence & Tracking

**Nexus: Gujarat Police Hackathon Prototype**

This is a complete, scalable, and interoperable CCTV intelligence solution that integrates heterogeneous feeds, performs vehicle identification, tracks routes across cameras, and matches vehicles against watchlists.

## Project Structure

- `backend/`: Python backend powered by FastAPI (API) and Streamlit (Data Dashboard). Uses YOLOv8 for vehicle and number plate detection.
- `frontend/`: React + Vite + Tailwind CSS frontend for the tactical command center.
- `Cross_Camera_Vehicle_Intelligence_Updated.pptx`: The updated presentation for the project pitch.

## Quick Setup Guide (Windows)

We have provided batch scripts to automate the installation and startup process.

### Prerequisites
- **Python 3.10+** (Make sure Python is added to your PATH)
- **Node.js v18+** (For the React Frontend)

### 1. Backend Setup

1. Open a terminal / command prompt.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend services:
   ```bash
   # Run the Streamlit Dashboard
   streamlit run app.py
   
   # In a new terminal, run the FastAPI server (if applicable)
   uvicorn server:app --reload --port 8000
   ```

### 2. Frontend Setup

1. Open a new terminal / command prompt.
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Install Node modules:
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```

### 3. Usage
- **React Command Center:** Open `http://localhost:5173` in your browser.
- **Streamlit Analytics Dashboard:** Open `http://localhost:8501`.
- **FastAPI Backend (Swagger UI):** Open `http://localhost:8000/docs`.

### Included Enhancements
- Added missing `requirements.txt` to the backend for seamless setup.
- Consolidated the project structure into one clear workspace.
- Updated and cleanly formatted the project presentation (`.pptx`).
- Added setup guide to easily boot the prototype on any Windows machine.
