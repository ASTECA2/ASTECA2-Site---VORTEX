# Dentro de models.py

from flask_sqlalchemy import SQLAlchemy  # <<< ADICIONEI ESTA LINHA
db = SQLAlchemy()                        # <<< E ESTA, PARA CRIAR O OBJETO DB AQUI

# O resto do seu código está perfeito e permanece igual.
from datetime import datetime
import json

class PortfolioItem(db.Model):
    __tablename__ = 'portfolio_items'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # design, video, links
    type = db.Column(db.String(20), nullable=False)  # image, video, link
    file_path = db.Column(db.String(500))  # Para arquivos de imagem/vídeo
    url = db.Column(db.String(500))  # Para links externos
    thumbnail_path = db.Column(db.String(500))  # Caminho da thumbnail
    tags = db.Column(db.Text)  # JSON string com as tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def __init__(self, title, description, category, type, file_path=None, url=None, thumbnail_path=None, tags=None):
        self.title = title
        self.description = description
        self.category = category
        self.type = type
        self.file_path = file_path
        self.url = url
        self.thumbnail_path = thumbnail_path
        self.tags = json.dumps(tags) if tags else json.dumps([])
    
    def get_tags(self):
        """Retorna as tags como lista"""
        try:
            return json.loads(self.tags) if self.tags else []
        except:
            return []
    
    def set_tags(self, tags_list):
        """Define as tags a partir de uma lista"""
        self.tags = json.dumps(tags_list) if tags_list else json.dumps([])
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'type': self.type,
            'file_path': self.file_path,
            'url': self.url,
            'thumbnail_path': self.thumbnail_path,
            'tags': self.get_tags(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    project_type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    
    def __init__(self, name, email, subject, message, phone=None, project_type=None):
        self.name = name
        self.email = email
        self.phone = phone
        self.subject = subject
        self.message = message
        self.project_type = project_type
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'project_type': self.project_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_read': self.is_read
        }