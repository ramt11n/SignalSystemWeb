import sympy as sp
import numpy as np
from scipy import signal as scipy_signal
from typing import Dict, List, Tuple, Any
import re

class MathEngine:
    def __init__(self):
        # Define symbols and functions for parsing
        self.t, self.s = sp.symbols('t s')
        self.n, self.z = sp.symbols('n z')

        # Create local dictionary for safe expression parsing
        self.local_dict = {
            't': self.t,
            's': self.s,
            'n': self.n,
            'z': self.z,
            'u': sp.Heaviside,  # Unit step function
            'delta': sp.DiracDelta,  # Impulse function
            'exp': sp.exp,
            'sin': sp.sin,
            'cos': sp.cos,
            'tan': sp.tan,
            'log': sp.log,
            'sqrt': sp.sqrt,
            'pi': sp.pi,
            'e': sp.E
        }

    def safe_parse_expression(self, expr_str: str) -> sp.Expr:
        """Safely parse a mathematical expression string into a SymPy object."""
        try:
            # Replace common function names
            expr_str = expr_str.replace('u(t)', 'Heaviside(t)')
            expr_str = expr_str.replace('δ(t)', 'DiracDelta(t)')
            expr_str = expr_str.replace('delta(t)', 'DiracDelta(t)')

            # Parse the expression
            expr = sp.parse_expr(expr_str, local_dict=self.local_dict)
            return expr
        except Exception as e:
            raise ValueError(f"Invalid expression: {expr_str}. Error: {str(e)}")

    def analyze_system_properties(self, equation_str: str) -> Dict[str, Any]:
        """Analyze system properties from a system equation."""
        try:
            # Parse the equation
            equation = self.safe_parse_expression(equation_str)

            # Initialize results
            results = {
                'linearity': {'is_linear': True, 'reason_key': 'explanations.linearSystem'},
                'causality': {'is_causal': True, 'reason_key': 'explanations.causalPastInput'},
                'stability': {'is_stable': True, 'reason_key': 'explanations.stableSystem'},
                'memory': {'has_memory': False, 'reason_key': 'explanations.memorylessCurrent'},
                'time_invariance': {'is_invariant': True, 'reason_key': 'explanations.timeInvariant'}
            }

            # Convert to string for analysis
            eq_str = str(equation).lower()

            # Check linearity
            if 'x[' in eq_str and ('^2' in eq_str or '**2' in eq_str or '*' in eq_str):
                results['linearity']['is_linear'] = False
                results['linearity']['reason_key'] = 'explanations.nonLinearSquare'

            # Check causality (look for future inputs)
            if 'x[t+1]' in eq_str or 'x[n+1]' in eq_str or 'x[t+2]' in eq_str:
                results['causality']['is_causal'] = False
                results['causality']['reason_key'] = 'explanations.nonCausalFuture'

            # Check memory (look for past inputs)
            if 'x[t-1]' in eq_str or 'x[n-1]' in eq_str or 'y[t-1]' in eq_str:
                results['memory']['has_memory'] = True
                results['memory']['reason_key'] = 'explanations.memoryPastInput'

            # Check time invariance
            if 't*' in eq_str or 'n*' in eq_str:
                results['time_invariance']['is_invariant'] = False
                results['time_invariance']['reason_key'] = 'explanations.timeVariant'

            # Check stability (simplified check)
            if 't*' in eq_str or 'n*' in eq_str or 'ramp' in eq_str:
                results['stability']['is_stable'] = False
                results['stability']['reason_key'] = 'explanations.unstableRamp'

            return results

        except Exception as e:
            raise ValueError(f"Error analyzing system properties: {str(e)}")

    def laplace_transform(self, expr_str: str) -> Dict[str, Any]:
        """Calculate the Laplace transform of a time-domain expression."""
        try:
            # Parse the expression
            expr = self.safe_parse_expression(expr_str)

            # Calculate Laplace transform
            laplace_expr, convergence_cond, _ = sp.laplace_transform(expr, self.t, self.s)

            # Get poles and zeros
            poles = []
            zeros = []

            # Find poles (denominator roots)
            if laplace_expr.is_Mul:
                numerator, denominator = laplace_expr.as_numer_denom()
                poles = sp.nroots(denominator)
                zeros = sp.nroots(numerator) if numerator != 1 else []

            # Convert to list of floats (real parts only for simplicity)
            poles_list = [float(pole.as_real_imag()[0]) for pole in poles if pole.is_real]
            zeros_list = [float(zero.as_real_imag()[0]) for zero in zeros if zero.is_real]

            return {
                'input_t': expr_str,
                'output_s': str(laplace_expr),
                'roc': str(convergence_cond) if convergence_cond != True else "All s",
                'poles': poles_list,
                'zeros': zeros_list
            }

        except Exception as e:
            raise ValueError(f"Error calculating Laplace transform: {str(e)}")

    def inverse_laplace_transform(self, expr_str: str, is_causal: bool = True) -> Dict[str, Any]:
        """Calculate the inverse Laplace transform with step-by-step solution."""
        try:
            # Parse the expression
            expr = self.safe_parse_expression(expr_str)

            # Calculate inverse Laplace transform
            inverse_expr = sp.inverse_laplace_transform(expr, self.s, self.t)

            # Generate step-by-step solution
            steps = []

            # Analyze the form and generate appropriate steps
            expr_str_lower = expr_str.lower()

            if '1/(s+' in expr_str_lower:
                match = re.search(r'1/\(s\+(\d+(?:\.\d+)?)\)', expr_str_lower)
                if match:
                    a = match.group(1)
                    steps = [
                        {'step': 'Identify form', 'value': '1/(s + a)'},
                        {'step': 'Lookup table', 'value': 'exp(-at)·u(t)'},
                        {'step': f'Substitute a', 'value': f'a = {a}'},
                        {'step': 'Final result', 'value': str(inverse_expr)}
                    ]

            elif expr_str_lower == '1/s':
                steps = [
                    {'step': 'Identify form', 'value': '1/s'},
                    {'step': 'Lookup table', 'value': 'u(t)'},
                    {'step': 'Final result', 'value': str(inverse_expr)}
                ]

            elif '1/s^2' in expr_str_lower:
                steps = [
                    {'step': 'Identify form', 'value': '1/s²'},
                    {'step': 'Lookup table', 'value': 't·u(t)'},
                    {'step': 'Final result', 'value': str(inverse_expr)}
                ]

            else:
                # Generic steps
                steps = [
                    {'step': 'Input expression', 'value': expr_str},
                    {'step': 'Apply inverse Laplace transform', 'value': str(inverse_expr)}
                ]

            # Apply causality if specified
            final_expr = str(inverse_expr)
            if is_causal and 'Heaviside(t)' not in final_expr:
                final_expr += '*Heaviside(t)'

            return {
                'input_s': expr_str,
                'output_t': final_expr,
                'steps': steps,
                'is_causal': is_causal
            }

        except Exception as e:
            raise ValueError(f"Error calculating inverse Laplace transform: {str(e)}")

    def calculate_convolution(self, signal_x: str, signal_h: str) -> Dict[str, Any]:
        """Calculate the convolution of two signals."""
        try:
            # Parse signals
            x_expr = self.safe_parse_expression(signal_x)
            h_expr = self.safe_parse_expression(signal_h)

            # Generate numerical arrays for plotting
            time_array = np.linspace(-5, 5, 200)

            # Evaluate signals numerically
            x_values = []
            h_values = []

            for t_val in time_array:
                try:
                    # Substitute numerical values
                    x_val = float(x_expr.subs(self.t, t_val).evalf())
                    h_val = float(h_expr.subs(self.t, t_val).evalf())

                    # Handle Heaviside function
                    if np.isnan(x_val) or np.isinf(x_val):
                        x_val = 0
                    if np.isnan(h_val) or np.isinf(h_val):
                        h_val = 0

                    x_values.append(x_val)
                    h_values.append(h_val)
                except:
                    x_values.append(0)
                    h_values.append(0)

            # Calculate convolution numerically
            output_values = np.convolve(x_values, h_values, mode='full')

            # Create symmetric time array for convolution result
            conv_time = np.linspace(-10, 10, len(output_values))

            # Generate symbolic result (simplified)
            symbolic_result = f"({signal_x}) * ({signal_h})"

            return {
                'signal_x': signal_x,
                'signal_h': signal_h,
                'time_array': conv_time.tolist(),
                'output_y_array': output_values.tolist(),
                'symbolic_result': symbolic_result
            }

        except Exception as e:
            raise ValueError(f"Error calculating convolution: {str(e)}")

    def analyze_lti_system(self, transfer_function: str) -> Dict[str, Any]:
        """Analyze LTI system from transfer function."""
        try:
            # Parse transfer function
            tf_expr = self.safe_parse_expression(transfer_function)

            # Find poles and zeros
            poles = []
            zeros = []

            if tf_expr.is_Mul:
                numerator, denominator = tf_expr.as_numer_denom()
                poles = sp.nroots(denominator)
                zeros = sp.nroots(numerator) if numerator != 1 else []

            # Extract poles and zeros as lists
            poles_list = [float(pole.as_real_imag()[0]) for pole in poles if pole.is_real]
            zeros_list = [float(zero.as_real_imag()[0]) for zero in zeros if zero.is_real]

            # Determine stability
            stability = 'stable'
            if any(pole > 0 for pole in poles_list):
                stability = 'unstable'
            elif any(pole == 0 for pole in poles_list):
                stability = 'marginallyStable'

            # Determine system type
            system_type = 'firstOrder' if len(poles_list) == 1 else 'secondOrder'

            # Calculate DC gain
            dc_gain = 0
            try:
                dc_gain = float(tf_expr.subs(self.s, 0).evalf())
            except:
                dc_gain = 0

            # Generate frequency response data
            frequencies = np.logspace(-2, 2, 100)
            magnitude = []
            phase = []

            for w in frequencies:
                try:
                    # Evaluate transfer function at s = jw
                    s_val = 1j * w
                    tf_val = complex(tf_expr.subs(self.s, s_val).evalf())

                    magnitude.append(20 * np.log10(abs(tf_val)))
                    phase.append(np.angle(tf_val, deg=True))
                except:
                    magnitude.append(-100)  # Very low value
                    phase.append(0)

            # Generate step response
            step_time = np.linspace(0, 10, 100)
            step_response = []

            for t_val in step_time:
                # Simplified step response calculation
                response = 0
                for pole in poles_list:
                    if pole < 0:
                        response += (1/abs(pole)) * (1 - np.exp(pole * t_val))
                    elif pole == 0:
                        response += t_val
                step_response.append(response)

            return {
                'transfer_function': transfer_function,
                'poles': poles_list,
                'zeros': zeros_list,
                'stability': stability,
                'type': system_type,
                'dcGain': dc_gain,
                'frequencyResponse': {
                    'frequencies': frequencies.tolist(),
                    'magnitude': magnitude,
                    'phase': phase
                },
                'stepResponse': {
                    'time': step_time.tolist(),
                    'response': step_response
                }
            }

        except Exception as e:
            raise ValueError(f"Error analyzing LTI system: {str(e)}")

# Create a singleton instance
math_engine = MathEngine()