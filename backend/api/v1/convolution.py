from fastapi import APIRouter, HTTPException
from services.math_engine import math_engine
from models.schemas import ConvolutionRequest, ConvolutionResponse

router = APIRouter()

@router.post("/calculate", response_model=ConvolutionResponse)
async def calculate_convolution(request: ConvolutionRequest):
    """
    Calculate the convolution of two signals.

    - **signal_x**: First signal expression (e.g., "Heaviside(t) - Heaviside(t-2)")
    - **signal_h**: Second signal expression (e.g., "Heaviside(t)")

    Returns the convolution result with numerical data for plotting.
    """
    try:
        result = math_engine.calculate_convolution(request.signal_x, request.signal_h)

        response = ConvolutionResponse(
            signal_x=result['signal_x'],
            signal_h=result['signal_h'],
            time_array=result['time_array'],
            output_y_array=result['output_y_array'],
            symbolic_result=result['symbolic_result']
        )

        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint for convolution service."""
    return {"status": "healthy", "service": "convolution"}