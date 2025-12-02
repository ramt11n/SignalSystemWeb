# Signal Companion - Bilingual Interactive Platform

**Signal Companion** is a comprehensive Single Page Application designed for "Signals and Systems" students. It offers full bilingual support (English/Persian) with dynamic layout switching (LTR/RTL) and a powerful Python backend for symbolic mathematical computations.

## ✨ Features

### 🌍 Internationalization
* **Bilingual Support:** Full English and Persian language support.
* **Dynamic Layout:** Automatic LTR/RTL layout switching based on language.
* **Seamless Switching:** Instant toggle between languages via the navbar.

### 📚 Educational Modules
1.  **Signal Library:** Interactive library of common signals with mathematical definitions and plots.
2.  **Property Analyzer:** Analyze system properties (Linearity, Causality, Stability, Memory, Time Invariance).
3.  **Convolution Engine:** Visualize convolution operations.
4.  **Laplace Calculator:** Compute Laplace transforms and visualize Pole-Zero plots.
5.  **Inverse Laplace Calculator:** Get step-by-step solutions for inverse Laplace transforms.
6.  **LTI Analyzer:** Analyze LTI systems (Frequency response, Step response, Impulse response, Stability).

### 🔧 Technical Stack
* **Frontend:** React 18, Vite, React Bootstrap 5
* **Visualization:** Plotly.js
* **Math Rendering:** KaTeX
* **Backend:** Python FastAPI
* **Computation:** SymPy, NumPy, SciPy

---

## 🚀 Getting Started

### Prerequisites
* Node.js 16+
* Python 3.10+

### 1. Backend Setup (Python)
The backend handles all mathematical calculations.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (Recommended):
    ```bash
    # Mac/Linux:
    python3 -m venv venv
    source venv/bin/activate

    # Windows:
    python -m venv venv
    venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    *Server will start at `http://127.0.0.1:8000`*

### 2. Frontend Setup (React)
1.  Open a new terminal in the project root.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```env
    VITE_API_BASE_URL="[http://127.0.0.1:8000](http://127.0.0.1:8000)"
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

The backend exposes the following endpoints via FastAPI:

* **Property Analyzer:** `POST /api/v1/properties/analyze`
* **Laplace Transform:** `POST /api/v1/laplace/transform`
* **Inverse Laplace:** `POST /api/v1/laplace/inverse`
* **Convolution:** `POST /api/v1/convolution/calculate`
* **LTI Analysis:** `POST /api/v1/lti/analyze`

---

## 📂 Project Structure
SignalSystemWeb/ ├── backend/ # Python FastAPI Backend │ ├── api/v1/ # API Route Handlers │ ├── services/ # Math Engine (SymPy logic) │ └── models/ # Pydantic Schemas ├── src/ # React Frontend │ ├── components/ # UI Components & Modules │ ├── i18n/ # Translation Config │ └── App.jsx # Main Layout Logic └── public/locales/ # Translation JSON files (en/fa)


---

### License
This project is designed for educational purposes.

**Designed By Ramtin Neshatvar**