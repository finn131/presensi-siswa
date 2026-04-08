import base64
import hashlib
import random
import secrets
import time
from flask import Blueprint, request, session, current_app
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash
from models import User
from utils.response import success_response, error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

CAPTCHA_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789#?@&%$!'


def _generate_captcha_code(length=5):
    return ''.join(random.choice(CAPTCHA_CHARS) for _ in range(length))


def _generate_captcha_svg(captcha_code):
    width = 180
    height = 60
    bg_colors = ['#f8fafc', '#f1f5f9', '#e2e8f0']
    stroke_colors = ['#94a3b8', '#64748b', '#475569']

    lines = []
    for _ in range(6):
        x1 = random.randint(0, width)
        y1 = random.randint(0, height)
        x2 = random.randint(0, width)
        y2 = random.randint(0, height)
        color = random.choice(stroke_colors)
        lines.append(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
            f'stroke="{color}" stroke-opacity="0.35" stroke-width="1.5"/>'
        )

    text_parts = []
    start_x = 24
    for index, char in enumerate(captcha_code):
        x = start_x + (index * 28)
        y = random.randint(36, 44)
        rotate = random.randint(-20, 20)
        color = random.choice(['#0f172a', '#1e293b', '#334155'])
        text_parts.append(
            f'<text x="{x}" y="{y}" fill="{color}" font-size="30" '
            f'font-weight="700" transform="rotate({rotate} {x} {y})">{char}</text>'
        )

    dots = []
    for _ in range(30):
        cx = random.randint(0, width)
        cy = random.randint(0, height)
        radius = random.randint(1, 2)
        dots.append(
            f'<circle cx="{cx}" cy="{cy}" r="{radius}" fill="#64748b" fill-opacity="0.25"/>'
        )

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">'
        f'<rect width="100%" height="100%" fill="{random.choice(bg_colors)}"/>'
        f'{"".join(lines)}'
        f'{"".join(dots)}'
        f'{"".join(text_parts)}'
        '</svg>'
    )
    return svg


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login endpoint"""
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    captcha_answer = str(data.get('captcha_answer', '')).strip()
    proof = str(data.get('proof', '')).strip()
    expected_captcha = session.get('captcha_answer')
    login_nonce = session.get('login_nonce')
    nonce_ts = session.get('login_nonce_ts')
    
    if not username or not password or not captcha_answer or not proof:
        return error_response('Username, password, captcha, dan proof diperlukan', 400)

    if expected_captcha is None:
        return error_response('Captcha belum dibuat. Muat ulang captcha gambar terlebih dahulu', 400)

    # Compare captcha case-insensitively because generated chars include mixed case.
    if captcha_answer.upper() != str(expected_captcha).upper():
        session.pop('captcha_answer', None)
        return error_response('Captcha salah', 400)

    if not login_nonce or not nonce_ts:
        return error_response('Nonce login tidak valid. Muat ulang captcha terlebih dahulu', 400)

    if time.time() - float(nonce_ts) > 120:
        session.pop('login_nonce', None)
        session.pop('login_nonce_ts', None)
        return error_response('Nonce login kedaluwarsa. Muat ulang captcha terlebih dahulu', 400)

    expected_proof = hashlib.sha256(
        f'{login_nonce}:{username}:{current_app.config["CLIENT_PROOF_KEY"]}'.encode('utf-8')
    ).hexdigest()

    if proof != expected_proof:
        session.pop('login_nonce', None)
        session.pop('login_nonce_ts', None)
        return error_response('Proof login tidak valid', 401)
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password, password):
        return error_response('Username atau password salah', 401)
    
    if not user.is_active:
        return error_response('User tidak aktif', 403)
    
    session.pop('captcha_answer', None)
    session.pop('login_nonce', None)
    session.pop('login_nonce_ts', None)
    login_user(user)
    session['proof_ok'] = True
    
    return success_response({
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role
        }
    }, 'Login berhasil', 200)


@auth_bp.route('/captcha', methods=['GET'])
def get_captcha():
    """Generate image captcha in SVG format"""
    captcha_code = _generate_captcha_code()
    session['captcha_answer'] = captcha_code
    session['login_nonce'] = secrets.token_hex(8)
    session['login_nonce_ts'] = time.time()
    svg = _generate_captcha_svg(captcha_code)
    encoded_svg = base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    image_data = f'data:image/svg+xml;base64,{encoded_svg}'

    return success_response(
        {'image': image_data, 'nonce': session['login_nonce']},
        'Captcha berhasil dibuat',
        200
    )


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout endpoint"""
    logout_user()
    session.pop('proof_ok', None)
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
