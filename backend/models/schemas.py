from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Property Analyzer Models
class PropertyAnalysisRequest(BaseModel):
    equation_str: str

class PropertyResult(BaseModel):
    is_linear: bool
    reason_key: str

class PropertyAnalysisResponse(BaseModel):
    linearity: PropertyResult
    causality: PropertyResult
    stability: PropertyResult
    memory: PropertyResult
    time_invariance: PropertyResult

# Laplace Transform Models
class LaplaceTransformRequest(BaseModel):
    expression_t: str

class LaplaceTransformResponse(BaseModel):
    input_t: str
    output_s: str
    roc: str
    poles: List[float]
    zeros: List[float]

# Inverse Laplace Transform Models
class InverseLaplaceRequest(BaseModel):
    expression_s: str
    is_causal: bool = True

class InverseStep(BaseModel):
    step: str
    value: str

class InverseLaplaceResponse(BaseModel):
    input_s: str
    output_t: str
    steps: List[InverseStep]
    is_causal: bool

# Convolution Models
class ConvolutionRequest(BaseModel):
    signal_x: str
    signal_h: str

class ConvolutionResponse(BaseModel):
    signal_x: str
    signal_h: str
    time_array: List[float]
    output_y_array: List[float]
    symbolic_result: str

# LTI Analyzer Models
class LTIAnalysisRequest(BaseModel):
    transfer_function: str

class FrequencyResponse(BaseModel):
    frequencies: List[float]
    magnitude: List[float]
    phase: List[float]

class StepResponse(BaseModel):
    time: List[float]
    response: List[float]

class LTIAnalysisResponse(BaseModel):
    transfer_function: str
    poles: List[float]
    zeros: List[float]
    stability: str
    type: str
    dcGain: float
    frequencyResponse: FrequencyResponse
    stepResponse: StepResponse

# Generic Error Response
class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None