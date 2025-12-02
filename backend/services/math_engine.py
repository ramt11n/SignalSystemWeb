import sympy as sp
import numpy as np
from scipy import signal as scipy_signal
from typing import Dict, List, Tuple, Any
import re

class MathEngine:
    def __init__(self):
        self.t, self.s = sp.symbols('t s')
        self.n, self.z = sp.symbols('n z')
        self.x = sp.Function('x')
        self.y = sp.Function('y')

        self.local_dict = {
            't': self.t, 's': self.s, 'n': self.n, 'z': self.z,
            'u': sp.Heaviside, 'delta': sp.DiracDelta,
            'exp': sp.exp, 'sin': sp.sin, 'cos': sp.cos, 'tan': sp.tan,
            'log': sp.log, 'sqrt': sp.sqrt, 'pi': sp.pi, 'e': sp.E,
            'Heaviside': sp.Heaviside, 'DiracDelta': sp.DiracDelta,
            'x': self.x, 'y': self.y
        }
        
        self.numerical_modules = [
            "numpy",
            { "Heaviside": lambda x: np.heaviside(x, 1), "DiracDelta": lambda x: np.where(x == 0, 1, 0) }
        ]

    def safe_parse_expression(self, expr_str: str) -> sp.Expr:
        try:
            # FIX: Handle equations by taking the right side
            if "=" in expr_str:
                expr_str = expr_str.split("=")[1]

            expr_str = expr_str.replace('[', '(').replace(']', ')')
            expr_str = expr_str.replace('^', '**')
            expr_str = re.sub(r'u\((.*?)\)', r'Heaviside(\1)', expr_str)
            expr_str = re.sub(r'δ\((.*?)\)', r'DiracDelta(\1)', expr_str)
            expr_str = re.sub(r'delta\((.*?)\)', r'DiracDelta(\1)', expr_str)

            expr = sp.parse_expr(expr_str, local_dict=self.local_dict, evaluate=False)
            return expr
        except Exception as e:
            raise ValueError(f"Invalid expression: {expr_str}. Error: {str(e)}")

    def analyze_system_properties(self, equation_str: str) -> Dict[str, Any]:
        try:
            # Initialize results with defaults
            results = {
                'linearity': {'is_linear': True, 'reason_key': 'explanations.linearSystem'},
                'causality': {'is_causal': True, 'reason_key': 'explanations.causalPastInput'},
                'stability': {'is_stable': True, 'reason_key': 'explanations.stableSystem'},
                'memory': {'has_memory': False, 'reason_key': 'explanations.memorylessCurrent'},
                'time_invariance': {'is_invariant': True, 'reason_key': 'explanations.timeInvariant'}
            }
            
            expr = self.safe_parse_expression(equation_str)
            eq_str = str(expr).lower()
            
            # Linearity
            if ('x(' in eq_str) and ('**' in eq_str or '*' in eq_str):
                if "x" in eq_str.split('*')[-1] or '**' in eq_str: 
                    results['linearity']['is_linear'] = False
                    results['linearity']['reason_key'] = 'explanations.nonLinearSquare'

            # Causality
            if 't + ' in eq_str or 'n + ' in eq_str:
                results['causality']['is_causal'] = False
                results['causality']['reason_key'] = 'explanations.nonCausalFuture'

            # Memory
            if 't - ' in eq_str or 'n - ' in eq_str or 't + ' in eq_str or 'n + ' in eq_str:
                results['memory']['has_memory'] = True
                results['memory']['reason_key'] = 'explanations.memoryPastInput'

            # Time Invariance
            if 't*' in eq_str or 'n*' in eq_str:
                results['time_invariance']['is_invariant'] = False
                results['time_invariance']['reason_key'] = 'explanations.timeVariant'

            # Stability
            if 't*' in eq_str or 'n*' in eq_str or 'exp(t)' in eq_str:
                results['stability']['is_stable'] = False
                results['stability']['reason_key'] = 'explanations.unstableRamp'

            return results

        except Exception as e:
            raise ValueError(f"Error analyzing properties: {str(e)}")

    # ... (Keep your existing laplace_transform, inverse, convolution, and lti methods below) ...
    # (I am not repeating them here to save space, but DO NOT DELETE THEM)
    def laplace_transform(self, expr_str: str) -> Dict[str, Any]:
        # ... paste your existing laplace_transform code here ...
        # (Or just keep the file as it was and only update safe_parse_expression and analyze_system_properties)
        try:
            expr = self.safe_parse_expression(expr_str)
            laplace_expr, convergence_cond, _ = sp.laplace_transform(expr, self.t, self.s, noconds=False)
            laplace_expr = laplace_expr.simplify()
            numerator, denominator = laplace_expr.as_numer_denom()
            poles = sp.solve(denominator, self.s)
            zeros = sp.solve(numerator, self.s)
            poles_list = [str(p.evalf()) for p in poles]
            zeros_list = [str(z.evalf()) for z in zeros]
            return {
                'input_t': expr_str,
                'output_s': str(laplace_expr),
                'roc': str(convergence_cond if convergence_cond is not True else "All s"),
                'poles': poles_list,
                'zeros': zeros_list
            }
        except Exception as e:
            raise ValueError(f"Error calculating Laplace transform: {str(e)}")

    def inverse_laplace_transform(self, expr_str: str, is_causal: bool = True) -> Dict[str, Any]:
        try:
            expr = self.safe_parse_expression(expr_str)
            expr = expr.simplify()
            inverse_expr = sp.inverse_laplace_transform(expr, self.s, self.t)
            steps = []
            try:
                partial_frac = expr.apart(self.s)
                steps.append({'step': 'Partial Fraction Expansion', 'value': str(partial_frac)})
                for term in partial_frac.args if partial_frac.is_Add else [partial_frac]:
                    term_inv = sp.inverse_laplace_transform(term, self.s, self.t)
                    steps.append({'step': f'Inverse of {term}', 'value': str(term_inv)})
            except Exception:
                steps.append({'step': 'Input expression', 'value': str(expr)})
            steps.append({'step': 'Final Sum', 'value': str(inverse_expr)})
            final_expr = str(inverse_expr)
            if is_causal and 'Heaviside(t)' not in final_expr and 'DiracDelta' not in final_expr:
                final_expr = f"({final_expr})*Heaviside(t)"
            return {
                'input_s': expr_str,
                'output_t': final_expr,
                'steps': steps,
                'is_causal': is_causal
            }
        except Exception as e:
            raise ValueError(f"Error calculating inverse Laplace transform: {str(e)}")

    def calculate_convolution(self, signal_x: str, signal_h: str) -> Dict[str, Any]:
        try:
            x_expr = self.safe_parse_expression(signal_x)
            h_expr = self.safe_parse_expression(signal_h)
            time_array = np.linspace(-5, 10, 400)
            dt = time_array[1] - time_array[0]
            x_func = sp.lambdify(self.t, x_expr, self.numerical_modules)
            h_func = sp.lambdify(self.t, h_expr, self.numerical_modules)
            x_values = x_func(time_array)
            h_values = h_func(time_array)
            output_values = scipy_signal.convolve(x_values, h_values, mode='full') * dt
            conv_time = np.linspace(time_array[0]*2, time_array[-1]*2, len(output_values))
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
        try:
            tf_expr = self.safe_parse_expression(transfer_function)
            tf_expr = tf_expr.simplify()
            numerator, denominator = tf_expr.as_numer_denom()
            poles = sp.solve(denominator, self.s)
            zeros = sp.solve(numerator, self.s)
            poles_list = [str(p.evalf()) for p in poles]
            zeros_list = [str(z.evalf()) for z in zeros]
            stability = 'stable'
            if not poles:
                stability = 'stable'
            else:
                real_poles = [sp.re(p.evalf()) for p in poles]
                if any(p > 0 for p in real_poles):
                    stability = 'unstable'
                elif any(p == 0 for p in real_poles) and max(real_poles) <= 0:
                    stability = 'marginallyStable'
            system_type = f"{len(poles)}-order"
            dc_gain = 0
            try:
                dc_gain = float(sp.limit(tf_expr, self.s, 0).evalf())
            except Exception:
                dc_gain = 0
            frequencies = np.logspace(-2, 2, 100)
            tf_func_numeric = sp.lambdify(self.s, tf_expr, 'numpy')
            w_vals = 1j * frequencies
            tf_vals = tf_func_numeric(w_vals)
            magnitude = (20 * np.log10(np.abs(tf_vals))).tolist()
            phase = (np.angle(tf_vals, deg=True)).tolist()
            step_time = np.linspace(0, 10, 100)
            X_step = 1/self.s
            Y_step_s = (tf_expr * X_step).simplify()
            step_resp_t = sp.inverse_laplace_transform(Y_step_s, self.s, self.t)
            step_func = sp.lambdify(self.t, step_resp_t, self.numerical_modules)
            step_response_values = step_func(step_time)
            impulse_resp_t = sp.inverse_laplace_transform(tf_expr, self.s, self.t)
            impulse_func = sp.lambdify(self.t, impulse_resp_t, self.numerical_modules)
            impulse_response_values = impulse_func(step_time)
            return {
                'transfer_function': transfer_function,
                'poles': poles_list,
                'zeros': zeros_list,
                'stability': stability,
                'type': system_type,
                'dcGain': dc_gain,
                'frequencyResponse': {
                    'frequencies': frequencies.tolist(),
                    'magnitude': [float(m) for m in magnitude],
                    'phase': [float(p) for p in phase]
                },
                'stepResponse': {
                    'time': step_time.tolist(),
                    'response': [float(r) for r in step_response_values]
                },
                'impulseResponse': {
                    'time': step_time.tolist(),
                    'response': [float(r) for r in impulse_response_values]
                }
            }
        except Exception as e:
            raise ValueError(f"Error analyzing LTI system: {str(e)} on line {e.__traceback__.tb_lineno}")

math_engine = MathEngine()