# Imports necessários
import os
from flask import Flask
from flask_cors import CORS

# Importa o 'db' do nosso ficheiro models.py
from models import db
# Importa o 'api_bp' (nosso blueprint de rotas) do ficheiro routes.py
from routes import api_bp

# Cria a aplicação Flask
app = Flask(__name__)

# Configura o CORS para permitir que o frontend (React) aceda à API
CORS(app)

# --- Configuração do Banco de Dados para a Render ---
# A Render fornece um disco persistente para guardar ficheiros.
# Este código usa esse disco para o seu banco de dados SQLite.
# Se estiver a executar localmente, ele cria o ficheiro na mesma pasta.
data_dir = os.environ.get('RENDER_DATA_DIR', os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(data_dir, 'app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o objeto do banco de dados com a nossa aplicação
db.init_app(app)

# Regista o nosso blueprint de rotas. Todas as rotas de routes.py
# agora estarão acessíveis sob o prefixo /api
app.register_blueprint(api_bp, url_prefix='/api')

# --- Criação das Tabelas do Banco de Dados ---
# Este bloco de código garante que o ficheiro do banco de dados e as tabelas
# sejam criados na primeira vez que a aplicação iniciar.
with app.app_context():
    # Garante que o diretório para o banco de dados exista
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    db.create_all()

# --- Rota de Teste ---
# Uma rota simples para verificar se o servidor está no ar
@app.route('/')
def index():
    return "O servidor Flask do portfólio está no ar!"