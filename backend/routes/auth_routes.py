from flask import Blueprint, request
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from models import db, User
from utils.response import success_response, error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login endpoint"""
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return error_response('Username dan password diperlukan', 400)
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password, password):
        return error_response('Username atau password salah', 401)
    
    if not user.is_active:
        return error_response('User tidak aktif', 403)
    
    login_user(user)
    
    return success_response({
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role
        }
    }, 'Login berhasil', 200)


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout endpoint"""
    logout_user()
    return success_response(message='Logout berhasil', code=200)


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user info"""
    if not current_user.is_authenticated:
        return error_response('Unauthorized', 401)
    
    return success_response({
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'role': current_user.role
        }
    })
