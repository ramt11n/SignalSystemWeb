from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os  # 1. IMPORT OS

# Import routers
from api.v1 import properties, laplace, convolution, lti

app = FastAPI(
    title="Signal Companion API",
    description="Backend API for Signal Companion - Mathematical computations for signals and systems",
    version="1.0.0"
)

# 2. DEFINE ALL YOUR ALLOWED ORIGINS
origins = [
    "http://localhost:5173",       # Your local React app
    "http://127.0.0.1:5173",      # Just in case
    "https://ramt11n.github.io",   # Your deployed GitHub Pages site
]

# 3. ADD YOUR DEPLOYED SERVER'S URL (from environment variable)
# This allows requests from your deployed Liara/PythonAnywhere server
prod_origin = os.getenv("CORS_ORIGIN")
if prod_origin:
    origins.append(prod_origin)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # 4. USE THE FULL 'origins' LIST
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(properties.router, prefix="/api/v1/properties", tags=["properties"])
app.include_router(laplace.router, prefix="/api/v1/laplace", tags=["laplace"])
app.include_router(convolution.router, prefix="/api/v1/convolution", tags=["convolution"])
app.include_router(lti.router, prefix="/api/v1/lti", tags=["lti"])

@app.get("/")
async def root():
    return {"message": "Signal Companion API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)