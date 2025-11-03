from fastapi import APIRouter, HTTPException
from services.math_engine import math_engine
from models.schemas import (
    LaplaceTransformRequest, LaplaceTransformResponse,
    InverseLaplaceRequest, InverseLaplaceResponse, InverseStep
)

router = APIRouter()

@router.post("/transform", response_model=LaplaceTransformResponse)
async def calculate_laplace_transform(request: LaplaceTransformRequest):
    """
    Calculate the Laplace transform of a time-domain expression.

    - **expression_t**: Time-domain expression (e.g., "exp(-2*t)*Heaviside(t)")

    Returns the s-domain expression, region of convergence, poles, and zeros.
    """
    try:
        result = math_engine.laplace_transform(request.expression_t)

        response = LaplaceTransformResponse(
            input_t=result['input_t'],
            output_s=result['output_s'],
            roc=result['roc'],
            poles=result['poles'],
            zeros=result['zeros']
        )

        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/inverse", response_model=InverseLaplaceResponse)
async def calculate_inverse_laplace_transform(request: InverseLaplaceRequest):
    """
    Calculate the inverse Laplace transform with step-by-step solution.

    - **expression_s**: S-domain expression (e.g., "1/(s+2)")
    - **is_causal**: Whether to multiply result by unit step function (default: true)

    Returns the time-domain expression and step-by-step solution.
    """
    try:
        result = math_engine.inverse_laplace_transform(request.expression_s, request.is_causal)

        # Convert steps to response model format
        steps = []
        for step in result['steps']:
            steps.append(InverseStep(step=step['step'], value=step['value']))

        response = InverseLaplaceResponse(
            input_s=result['input_s'],
            output_t=result['output_t'],
            steps=steps,
            is_causal=result['is_causal']
        )

        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint for laplace service."""
    return {"status": "healthy", "service": "laplace"}