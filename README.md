# Signal Companion - Bilingual Interactive Platform

A comprehensive Single Page Application for "Signals and Systems" students with full bilingual support (English/Persian) and dynamic LTR/RTL layout switching.

## Features

### 🌍 Internationalization
- **Bilingual Support**: Full English and Persian language support
- **Dynamic Layout Switching**: Automatic LTR/RTL layout based on selected language
- **Language Switcher**: Easy toggle between languages in the navbar
- **React Bootstrap RTL**: Full RTL support for Persian language

### 📚 Educational Modules
1. **Signal Library**: Interactive library of common signals with plots
2. **Property Analyzer**: Analyze system properties (linearity, causality, stability, memory, time invariance)
3. **Convolution Engine**: Calculate and visualize convolution with animation
4. **Laplace Calculator**: Calculate Laplace transforms with pole-zero plots
5. **Inverse Laplace Calculator**: Step-by-step inverse Laplace transform solutions
6. **LTI Analyzer**: Comprehensive LTI system analysis with frequency response

### 🎨 User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Dynamic Sidebar**: Changes position based on language direction
- **Interactive Plots**: Powered by Plotly.js for data visualization
- **Mathematical Expressions**: Clean rendering of mathematical formulas

### 🔧 Technical Stack
- **Frontend**: React 18, Vite, React Bootstrap 5
- **Internationalization**: react-i18next
- **Visualization**: Plotly.js, KaTeX
- **Backend**: Python FastAPI with SymPy
- **Mathematical Computing**: SymPy, NumPy, SciPy

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.10+

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
python main.py
```

4. API documentation available at [http://localhost:8000/docs](http://localhost:8000/docs)

## Usage

### Language Switching
- Click the language switcher (EN/FA) in the top navigation bar
- The entire interface switches language and layout direction
- Persian (RTL) moves the sidebar to the right
- English (LTR) keeps the sidebar on the left

### Module Navigation
- Use the sidebar to navigate between modules
- Each module is self-contained with its own functionality
- All text content is translated into both languages

### Mathematical Expressions
- Enter expressions using standard mathematical notation
- Examples: `exp(-2*t)*u(t)`, `sin(2*pi*t)`, `1/(s+2)`
- The backend handles symbolic computations using SymPy

## API Endpoints

### Property Analyzer
- `POST /api/v1/properties/analyze` - Analyze system properties

### Laplace Transform
- `POST /api/v1/laplace/transform` - Calculate Laplace transform
- `POST /api/v1/laplace/inverse` - Calculate inverse Laplace transform

### Convolution
- `POST /api/v1/convolution/calculate` - Calculate signal convolution

### LTI Analysis
- `POST /api/v1/lti/analyze` - Analyze LTI systems

## Project Structure

```
SignalSystemWeb/
├── src/
│   ├── components/          # React components
│   │   ├── Module1/        # Signal Library
│   │   ├── Module2/        # Property Analyzer
│   │   ├── Module3/        # Convolution Engine
│   │   ├── Module4/        # Laplace Calculator
│   │   ├── Module5/        # Inverse Laplace Calculator
│   │   └── Module6/        # LTI Analyzer
│   ├── i18n/               # Internationalization configuration
│   └── services/           # API client services
├── public/
│   └── locales/            # Translation files
│       ├── en/            # English translations
│       └── fa/            # Persian translations
└── backend/
    ├── api/v1/            # FastAPI endpoints
    ├── services/          # Mathematical computation engine
    └── models/            # Pydantic models
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_DEV_MODE=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is designed for educational purposes for Signals and Systems students.

---

Designed By Ramtin Neshatvar
