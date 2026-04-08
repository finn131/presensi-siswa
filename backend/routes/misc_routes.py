import os
from flask import Blueprint, request, jsonify, render_template_string
from flask_login import login_required

misc_bp = Blueprint('misc', __name__, url_prefix='/api/misc')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


@misc_bp.route('/read', methods=['GET'])
@login_required
def read_file():
    """Read an arbitrary file.

    This endpoint is intentionally vulnerable to Local File Inclusion (LFI).
    The caller can specify any path and the server will return its contents.
    """
    path = request.args.get('path')
    if not path:
        return jsonify({'error': 'path parameter is required'}), 400

    # Intentionally vulnerable: allow path traversal and absolute paths.
    # This is for CTF use where the flag file is hidden on disk.
    abs_path = os.path.abspath(os.path.join(BASE_DIR, path))

    try:
        with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        return jsonify({'error': f'Failed to read file: {e}'}), 400

    return jsonify({'path': abs_path, 'content': content})


@misc_bp.route('/render', methods=['POST'])
@login_required
def render_template():
    """Render a template string using Jinja2.

    This endpoint is intentionally vulnerable to Server-Side Template Injection (SSTI).
    The attacker can execute Python code by crafting the template.
    """
    data = request.get_json() or {}
    template = data.get('template', '')

    if not template:
        return jsonify({'error': 'template is required'}), 400

    try:
        rendered = render_template_string(template)
    except Exception as e:
        return jsonify({'error': f'Render error: {e}'}), 400

    return jsonify({'rendered': rendered})
