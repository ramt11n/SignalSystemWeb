from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Import routers
from api.v1 import properties, laplace, convolution

app = FastAPI(
    title="Signal Companion API",
    description="Backend API for Signal Companion - Mathematical computations for signals and systems",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(properties.router, prefix="/api/v1/properties", tags=["properties"])
app.include_router(laplace.router, prefix="/api/v1/laplace", tags=["laplace"])
app.include_router(convolution.router, prefix="/api/v1/convolution", tags=["convolution"])

@app.get("/")
async def root():
    return {"message": "Signal Companion API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)