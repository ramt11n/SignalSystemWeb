from fastapi import APIRouter, HTTPException
from services.math_engine import math_engine
from models.schemas import (
    PropertyAnalysisRequest, 
    PropertyAnalysisResponse, 
    LinearityResult,
    CausalityResult,
    StabilityResult,
    MemoryResult,
    TimeInvarianceResult
)

router = APIRouter()

@router.post("/analyze", response_model=PropertyAnalysisResponse)
async def analyze_system_properties(request: PropertyAnalysisRequest):
    try:
        result = math_engine.analyze_system_properties(request.equation_str)

        # Map dictionary values to the specific Pydantic models
        response = PropertyAnalysisResponse(
            linearity=LinearityResult(
                is_linear=result['linearity']['is_linear'],
                reason_key=result['linearity']['reason_key']
            ),
            causality=CausalityResult(
                is_causal=result['causality']['is_causal'],
                reason_key=result['causality']['reason_key']
            ),
            stability=StabilityResult(
                is_stable=result['stability']['is_stable'],
                reason_key=result['stability']['reason_key']
            ),
            memory=MemoryResult(
                has_memory=result['memory']['has_memory'],
                reason_key=result['memory']['reason_key']
            ),
            time_invariance=TimeInvarianceResult(
                is_invariant=result['time_invariance']['is_invariant'],
                reason_key=result['time_invariance']['reason_key']
            )
        )

        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")