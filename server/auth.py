import jwt
import uuid
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from models import User, AdminSession

class AuthManager:
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        app.config.setdefault('SECRET_KEY', 'your-secret-key-change-this')
        app.config.setdefault('SESSION_DURATION_HOURS', 24)
    
    def generate_session_token(self):
        """Gera um token de sessão único"""
        return str(uuid.uuid4())
    
    def create_session(self, user_id):
        """Cria uma nova sessão para o usuário"""
        session_token = self.generate_session_token()
        expires_at = datetime.utcnow() + timedelta(hours=current_app.config['SESSION_DURATION_HOURS'])
        
        # Remove sessões antigas do usuário
        AdminSession.query.filter_by(user_id=user_id, is_active=True).update({'is_active': False})
        
        # Cria nova sessão
        session = AdminSession(
            user_id=user_id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        db.session.add(session)
        db.session.commit()
        
        return session_token
    
    def validate_session(self, session_token):
        """Valida um token de sessão"""
        if not session_token:
            return None
        
        session = AdminSession.query.filter_by(
            session_token=session_token,
            is_active=True
        ).first()
        
        if not session or session.is_expired():
            if session:
                session.is_active = False
                db.session.commit()
            return None
        
        return session.user
    
    def logout_session(self, session_token):
        """Encerra uma sessão"""
        session = AdminSession.query.filter_by(
            session_token=session_token,
            is_active=True
        ).first()
        
        if session:
            session.is_active = False
            db.session.commit()
            return True
        
        return False
    
    def authenticate_user(self, username, password):
        """Autentica um usuário"""
        user = User.query.filter_by(username=username, is_active=True).first()
        
        if user and user.check_password(password):
            # Atualiza último login
            user.last_login = datetime.utcnow()
            db.session.commit()
            return user
        
        return None

# Instância global do gerenciador de autenticação
auth_manager = AuthManager()

def require_auth(f):
    """Decorator para proteger rotas que requerem autenticação"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Verifica token no header Authorization
        auth_header = request.headers.get('Authorization')
        session_token = None
        
        if auth_header and auth_header.startswith('Bearer '):
            session_token = auth_header.split(' ')[1]
        
        # Verifica token nos cookies
        if not session_token:
            session_token = request.cookies.get('session_token')
        
        user = auth_manager.validate_session(session_token)
        
        if not user:
            return jsonify({'error': 'Token de autenticação inválido ou expirado'}), 401
        
        # Adiciona o usuário ao contexto da requisição
        request.current_user = user
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_admin(f):
    """Decorator para proteger rotas que requerem privilégios de admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Primeiro verifica autenticação
        auth_header = request.headers.get('Authorization')
        session_token = None
        
        if auth_header and auth_header.startswith('Bearer '):
            session_token = auth_header.split(' ')[1]
        
        if not session_token:
            session_token = request.cookies.get('session_token')
        
        user = auth_manager.validate_session(session_token)
        
        if not user:
            return jsonify({'error': 'Token de autenticação inválido ou expirado'}), 401
        
        if not user.is_admin:
            return jsonify({'error': 'Acesso negado. Privilégios de administrador necessários'}), 403
        
        request.current_user = user
        
        return f(*args, **kwargs)
    
    return decorated_function

def create_default_admin():
    """Cria um usuário administrador padrão se não existir"""
    admin = User.query.filter_by(username='admin').first()
    
    if not admin:
        admin = User(
            username='admin',
            email='admin@asteca2.com',
            password='admin123',  # ALTERE ESTA SENHA EM PRODUÇÃO
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()
        print("Usuário administrador padrão criado:")
        print("Username: admin")
        print("Password: admin123")
        print("IMPORTANTE: Altere esta senha em produção!")
    
    return admin

