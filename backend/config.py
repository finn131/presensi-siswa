import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    SERVER_SECRET = os.environ.get('SERVER_SECRET', 'dev-server-secret-change-in-production')
    CLIENT_PROOF_KEY = os.environ.get('CLIENT_PROOF_KEY', 'nx_gate_42')
    FLAG_VALUE = os.environ.get('FLAG_VALUE', 'Nyxx{cl13n7_s1d3_crypt0_1s_n0t_s3cur3}')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'sqlite:///' + os.path.join(basedir, 'database.db')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Flask-Login
    REMEMBER_COOKIE_DURATION = timedelta(days=7)
    
    # RFID Config: jam >= 07:00 dianggap terlambat
    RFID_CUTOFF_HOUR = int(os.environ.get('RFID_CUTOFF_HOUR', 7))
    RFID_CUTOFF_MINUTE = int(os.environ.get('RFID_CUTOFF_MINUTE', 0))
    RFID_CUTOFF_TIME = (RFID_CUTOFF_HOUR, RFID_CUTOFF_MINUTE)
    

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
