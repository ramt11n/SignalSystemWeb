from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from services.math_engine import math_engine
from models.schemas import PropertyAnalysisRequest, PropertyAnalysisResponse, PropertyResult, ErrorResponse

router = APIRouter()

@router.post("/analyze", response_model=PropertyAnalysisResponse)
async def analyze_system_properties(request: PropertyAnalysisRequest):
    """
    Analyze system properties from a system equation.

    - **equation_str**: System equation to analyze (e.g., "y(t) = 2*x(t) + 1")

    Returns analysis of linearity, causality, stability, memory, and time invariance.
    """
    try:
        result = math_engine.analyze_system_properties(request.equation_str)

        # Convert to response model format
        response = PropertyAnalysisResponse(
            linearity=PropertyResult(
                is_linear=result['linearity']['is_linear'],
                reason_key=result['linearity']['reason_key']
            ),
            causality=PropertyResult(
                is_causal=result['causality']['is_causal'],
                reason_key=result['causality']['reason_key']
            ),
            stability=PropertyResult(
                is_stable=result['stability']['is_stable'],
                reason_key=result['stability']['reason_key']
            ),
            memory=PropertyResult(
                has_memory=result['memory']['has_memory'],
                reason_key=result['memory']['reason_key']
            ),
            time_invariance=PropertyResult(
                is_invariant=result['time_invariance']['is_invariant'],
                reason_key=result['time_invariance']['reason_key']
            )
        )

        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint for properties service."""
    return {"status": "healthy", "service": "properties"}