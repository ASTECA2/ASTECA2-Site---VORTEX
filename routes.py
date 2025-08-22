# Dentro de routes.py

from flask import Blueprint, request, jsonify
# Importa o 'db' e as classes de modelo do nosso arquivo models.py
from models import db, PortfolioItem, ContactMessage

# Cria um "Blueprint". Pense nele como um organizador de rotas.
# Todas as rotas definidas aqui serão registradas depois no app principal.
api_bp = Blueprint('api', __name__)

# --- ROTAS DO PORTFÓLIO ---

# Rota para OBTER todos os itens do portfólio
@api_bp.route('/portfolio', methods=['GET'])
def get_portfolio_items():
    try:
        items = PortfolioItem.query.order_by(PortfolioItem.created_at.desc()).all()
        # Converte cada item para um dicionário e retorna como JSON
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        # Em caso de erro, retorna uma mensagem clara
        return jsonify({'error': str(e)}), 500

# Rota para ADICIONAR um novo item ao portfólio (do painel Admin)
@api_bp.route('/portfolio', methods=['POST'])
def add_portfolio_item():
    # NOTA: Esta é uma versão simplificada que lida com dados de texto/links.
    # A lógica para fazer upload de ficheiros de imagem/vídeo é mais complexa.
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Nenhum dado enviado'}), 400

    try:
        new_item = PortfolioItem(
            title=data.get('title'),
            description=data.get('description'),
            category=data.get('category'),
            type=data.get('type'),
            url=data.get('url'),
            tags=data.get('tags', [])
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# --- ROTA DE CONTATO ---

# Rota para RECEBER uma mensagem do formulário de contato
@api_bp.route('/contact', methods=['POST'])
def handle_contact_form():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Nenhum dado enviado'}), 400

    try:
        new_message = ContactMessage(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            subject=data.get('subject'),
            message=data.get('message'),
            project_type=data.get('projectType') # 'projectType' como está no seu formulário React
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'message': 'Mensagem recebida com sucesso!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500