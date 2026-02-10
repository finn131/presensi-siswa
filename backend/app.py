import os
from flask import Flask
from flask_login import LoginManager
from flask_socketio import SocketIO
from config import config
from models import db, User
from routes.auth_routes import auth_bp
from routes.absensi_routes import absensi_bp
from routes.siswa_routes import siswa_bp
from routes.laporan_routes import laporan_bp


def create_app(config_name=None):
    """Application factory"""
    
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)
    
    socketio = SocketIO(app, cors_allowed_origins='*')
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(absensi_bp)
    app.register_blueprint(siswa_bp)
    app.register_blueprint(laporan_bp)
    
    # Root route
    @app.route('/')
    def index():
        return {
            'message': 'Sistem Presensi Siswa API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'auth': '/api/auth',
                'absensi': '/api/absensi',
                'siswa': '/api/siswa',
                'laporan': '/api/laporan'
                }
            }, 200
    
        @app.route('/health')
        def health():
            return {'status': 'ok'}, 200
    
    # Context processor to make socketio available in templates
    @app.context_processor
    def inject_socketio():
        return {'socketio': socketio}
    
    # Socket events
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')
    
    return app, socketio


if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
