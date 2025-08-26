import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from models_updated import db
from routes_updated import api_bp
from auth import auth_manager, create_default_admin

def create_app():
    """Factory function para criar a aplicação Flask"""
    app = Flask(__name__)
    
    # Configuração CORS
    CORS(app, supports_credentials=True, origins=['*'])
    
    # Configurações da aplicação
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')
    app.config['SESSION_DURATION_HOURS'] = int(os.environ.get('SESSION_DURATION_HOURS', '24'))
    
    # Configuração do banco de dados
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        # PostgreSQL em produção
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        # SQLite para desenvolvimento local
        data_dir = os.environ.get('RENDER_DATA_DIR', os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(data_dir, 'app.db')
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
        
        # Garante que o diretório existe
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializa extensões
    db.init_app(app)
    auth_manager.init_app(app)
    
    # Registra blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Rota para servir arquivos estáticos (uploads)
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory('uploads', filename)
    
    # Rota de teste
    @app.route('/')
    def index():
        return "API do Portfólio ASTECA2 - VORTEX está funcionando!"
    
    # Rota de health check
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'API funcionando corretamente'}
    
    # Inicialização do banco de dados
    with app.app_context():
        try:
            db.create_all()
            # Cria usuário administrador padrão
            create_default_admin()
            print("Banco de dados inicializado com sucesso!")
        except Exception as e:
            print(f"Erro ao inicializar banco de dados: {e}")
    
    return app

# Cria a aplicação
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )

