from flask import Blueprint, request, jsonify, make_response
from werkzeug.utils import secure_filename
from models_updated import db, User, PortfolioItem, ContactMessage, AdminSession
from auth import auth_manager, require_auth, require_admin
import os
import uuid
from datetime import datetime

# Cria o blueprint para as rotas da API
api_bp = Blueprint('api', __name__)

# Configurações para upload de arquivos
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    """Garante que a pasta de uploads existe"""
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

# ===== ROTAS DE AUTENTICAÇÃO =====

@api_bp.route('/auth/login', methods=['POST'])
def login():
    """Rota para login de usuários"""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username e password são obrigatórios'}), 400
        
        user = auth_manager.authenticate_user(data['username'], data['password'])
        
        if not user:
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Cria sessão
        session_token = auth_manager.create_session(user.id)
        
        response = make_response(jsonify({
            'message': 'Login realizado com sucesso',
            'user': user.to_dict(),
            'session_token': session_token
        }))
        
        # Define cookie com token de sessão
        response.set_cookie('session_token', session_token, 
                          max_age=24*60*60,  # 24 horas
                          httponly=True, 
                          secure=False,  # True em produção com HTTPS
                          samesite='Lax')
        
        return response
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/auth/logout', methods=['POST'])
@require_auth
def logout():
    """Rota para logout de usuários"""
    try:
        # Pega token do header ou cookie
        auth_header = request.headers.get('Authorization')
        session_token = None
        
        if auth_header and auth_header.startswith('Bearer '):
            session_token = auth_header.split(' ')[1]
        
        if not session_token:
            session_token = request.cookies.get('session_token')
        
        if session_token:
            auth_manager.logout_session(session_token)
        
        response = make_response(jsonify({'message': 'Logout realizado com sucesso'}))
        response.set_cookie('session_token', '', expires=0)
        
        return response
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/auth/me', methods=['GET'])
@require_auth
def get_current_user():
    """Retorna informações do usuário atual"""
    try:
        return jsonify({
            'user': request.current_user.to_dict(),
            'authenticated': True
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/auth/change-password', methods=['POST'])
@require_auth
def change_password():
    """Permite ao usuário alterar sua senha"""
    try:
        data = request.get_json()
        
        if not data or not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Senha atual e nova senha são obrigatórias'}), 400
        
        user = request.current_user
        
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Senha atual incorreta'}), 400
        
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Senha alterada com sucesso'})
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

# ===== ROTAS DO PORTFÓLIO =====

@api_bp.route('/portfolio', methods=['GET'])
def get_portfolio_items():
    """Retorna todos os itens do portfólio ativos"""
    try:
        # Parâmetros de filtro opcionais
        category = request.args.get('category')
        item_type = request.args.get('type')
        
        query = PortfolioItem.query.filter_by(is_active=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if item_type:
            query = query.filter_by(type=item_type)
        
        items = query.order_by(PortfolioItem.created_at.desc()).all()
        
        return jsonify({
            'items': [item.to_dict() for item in items],
            'total': len(items)
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/portfolio/<int:item_id>', methods=['GET'])
def get_portfolio_item(item_id):
    """Retorna um item específico do portfólio"""
    try:
        item = PortfolioItem.query.filter_by(id=item_id, is_active=True).first()
        
        if not item:
            return jsonify({'error': 'Item não encontrado'}), 404
        
        return jsonify({'item': item.to_dict()})
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/admin/portfolio', methods=['POST'])
@require_admin
def create_portfolio_item():
    """Cria um novo item no portfólio"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        required_fields = ['title', 'description', 'category', 'type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Valida tipo
        if data['type'] not in ['image', 'video', 'link']:
            return jsonify({'error': 'Tipo deve ser: image, video ou link'}), 400
        
        # Cria o item
        item = PortfolioItem(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            type=data['type'],
            file_path=data.get('file_path'),
            url=data.get('url'),
            thumbnail_path=data.get('thumbnail_path'),
            tags=data.get('tags', []),
            created_by=request.current_user.id
        )
        
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            'message': 'Item criado com sucesso',
            'item': item.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/admin/portfolio/<int:item_id>', methods=['PUT'])
@require_admin
def update_portfolio_item(item_id):
    """Atualiza um item do portfólio"""
    try:
        item = PortfolioItem.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Item não encontrado'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Atualiza campos fornecidos
        if 'title' in data:
            item.title = data['title']
        if 'description' in data:
            item.description = data['description']
        if 'category' in data:
            item.category = data['category']
        if 'type' in data and data['type'] in ['image', 'video', 'link']:
            item.type = data['type']
        if 'file_path' in data:
            item.file_path = data['file_path']
        if 'url' in data:
            item.url = data['url']
        if 'thumbnail_path' in data:
            item.thumbnail_path = data['thumbnail_path']
        if 'tags' in data:
            item.set_tags(data['tags'])
        if 'is_active' in data:
            item.is_active = data['is_active']
        
        item.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Item atualizado com sucesso',
            'item': item.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/admin/portfolio/<int:item_id>', methods=['DELETE'])
@require_admin
def delete_portfolio_item(item_id):
    """Deleta um item do portfólio"""
    try:
        item = PortfolioItem.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Item não encontrado'}), 404
        
        # Soft delete - apenas marca como inativo
        item.is_active = False
        item.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Item deletado com sucesso'})
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/admin/portfolio', methods=['GET'])
@require_admin
def get_admin_portfolio_items():
    """Retorna todos os itens do portfólio para administração (incluindo inativos)"""
    try:
        # Parâmetros de filtro opcionais
        category = request.args.get('category')
        item_type = request.args.get('type')
        include_inactive = request.args.get('include_inactive', 'false').lower() == 'true'
        
        query = PortfolioItem.query
        
        if not include_inactive:
            query = query.filter_by(is_active=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if item_type:
            query = query.filter_by(type=item_type)
        
        items = query.order_by(PortfolioItem.created_at.desc()).all()
        
        return jsonify({
            'items': [item.to_dict() for item in items],
            'total': len(items)
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

# ===== ROTAS DE UPLOAD =====

@api_bp.route('/admin/upload', methods=['POST'])
@require_admin
def upload_file():
    """Upload de arquivos para o servidor"""
    try:
        ensure_upload_folder()
        
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo fornecido'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        if file and allowed_file(file.filename):
            # Gera nome único para o arquivo
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            file.save(file_path)
            
            return jsonify({
                'message': 'Arquivo enviado com sucesso',
                'file_path': file_path,
                'original_filename': filename
            })
        
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

# ===== ROTAS DE CONTATO =====

@api_bp.route('/contact', methods=['POST'])
def create_contact_message():
    """Cria uma nova mensagem de contato"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        message = ContactMessage(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            subject=data['subject'],
            message=data['message'],
            project_type=data.get('project_type')
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'message': 'Mensagem enviada com sucesso',
            'contact_message': message.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/admin/contact', methods=['GET'])
@require_admin
def get_contact_messages():
    """Retorna todas as mensagens de contato"""
    try:
        messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
        
        return jsonify({
            'messages': [message.to_dict() for message in messages],
            'total': len(messages)
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@api_bp.route('/admin/contact/<int:message_id>/read', methods=['PUT'])
@require_admin
def mark_message_as_read(message_id):
    """Marca uma mensagem como lida"""
    try:
        message = ContactMessage.query.get(message_id)
        
        if not message:
            return jsonify({'error': 'Mensagem não encontrada'}), 404
        
        message.is_read = True
        db.session.commit()
        
        return jsonify({'message': 'Mensagem marcada como lida'})
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

# ===== ROTAS DE ESTATÍSTICAS =====

@api_bp.route('/admin/stats', methods=['GET'])
@require_admin
def get_admin_stats():
    """Retorna estatísticas para o painel administrativo"""
    try:
        total_items = PortfolioItem.query.filter_by(is_active=True).count()
        total_images = PortfolioItem.query.filter_by(type='image', is_active=True).count()
        total_videos = PortfolioItem.query.filter_by(type='video', is_active=True).count()
        total_links = PortfolioItem.query.filter_by(type='link', is_active=True).count()
        total_messages = ContactMessage.query.count()
        unread_messages = ContactMessage.query.filter_by(is_read=False).count()
        
        return jsonify({
            'portfolio': {
                'total_items': total_items,
                'images': total_images,
                'videos': total_videos,
                'links': total_links
            },
            'contact': {
                'total_messages': total_messages,
                'unread_messages': unread_messages
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

