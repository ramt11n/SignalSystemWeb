from fastapi import APIRouter, HTTPException
from services.math_engine import math_engine
from models.schemas import LTIAnalysisRequest, LTIAnalysisResponse, FrequencyResponse, StepResponse

router = APIRouter()

@router.post("/analyze", response_model=LTIAnalysisResponse)
async def analyze_lti_system(request: LTIAnalysisRequest):
    """
    Analyze Linear Time-Invariant (LTI) system from transfer function.

    - **transfer_function**: Transfer function in s-domain (e.g., "1/(s+2)")

    Returns system analysis including poles, zeros, stability, and frequency response.
    """
    try:
        result = math_engine.analyze_lti_system(request.transfer_function)

        # Convert to response model format
        frequency_response = FrequencyResponse(
            frequencies=result['frequencyResponse']['frequencies'],
            magnitude=result['frequencyResponse']['magnitude'],
            phase=result['frequencyResponse']['phase']
        )

        step_response = StepResponse(
            time=result['stepResponse']['time'],
            response=result['stepResponse']['response']
        )

        response = LTIAnalysisResponse(
            transfer_function=result['transfer_function'],
            poles=result['poles'],
            zeros=result['zeros'],
            stability=result['stability'],
            type=result['type'],
            dcGain=result['dcGain'],
            frequencyResponse=frequency_response,
            stepResponse=step_response
        )

        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint for LTI service."""
    return {"status": "healthy", "service": "lti"}