import base64
from flask import Blueprint, session, current_app
from flask_login import login_required
from utils.response import success_response, error_response


flag_bp = Blueprint('flag', __name__, url_prefix='/api/flag')


def _xor_bytes(data: bytes, key: bytes) -> bytes:
    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))


@flag_bp.route('/', methods=['GET'])
@login_required
def get_flag():
    if not session.get('proof_ok'):
        return error_response('Proof belum tervalidasi', 403)

    flag = current_app.config['FLAG_VALUE']

    key = current_app.config['CLIENT_PROOF_KEY'].encode('utf-8')
    token = base64.b64encode(_xor_bytes(flag.encode('utf-8'), key)).decode('utf-8')

    return success_response({'token': token}, 'Flag token', 200)
