from functools import wraps
from flask import jsonify, request
from flask_login import current_user


def success_response(data=None, message="Success", code=200):
    """Standard success response"""
    return jsonify({
        'success': True,
        'message': message,
        'data': data
    }), code


def error_response(message="Error", code=400, error=None):
    """Standard error response"""
    response = {
        'success': False,
        'message': message,
    }
    if error:
        response['error'] = error
    return jsonify(response), code


def require_role(*roles):
    """Decorator to check user role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return error_response('Unauthorized', 401)
            if current_user.role not in roles:
                return error_response('Forbidden', 403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator
