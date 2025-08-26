# Comandos para Deploy - ASTECA2 VORTEX

## 🚀 Deploy Completo - Passo a Passo

### 1. Preparação do Repositório

```bash
# 1. Fazer backup dos arquivos originais
git checkout -b backup-original
git add .
git commit -m "Backup dos arquivos originais"

# 2. Voltar para branch principal
git checkout main

# 3. Substituir arquivos pelo código atualizado
cp main_updated.py main.py
cp models_updated.py models.py
cp routes_updated.py routes.py
cp requirements_updated.txt requirements.txt
cp AppUpdated.jsx App.jsx
cp components/HomeUpdated.jsx components/Home.jsx
cp components/AdminUpdated.jsx components/Admin.jsx
cp components/PortfolioUpdated.jsx components/Portfolio.jsx

# 4. Adicionar novos arquivos
git add .
git commit -m "Implementação completa: banco de dados, autenticação e área administrativa"
git push origin main
```

### 2. Configuração do Banco de Dados PostgreSQL

#### Opção A: Vercel Postgres (Recomendado)
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login no Vercel
vercel login

# 3. Criar banco PostgreSQL
# - Acesse https://vercel.com/dashboard
# - Vá em "Storage" → "Create Database" → "Postgres"
# - Escolha um nome (ex: asteca2-db)
# - Copie a DATABASE_URL fornecida
```

#### Opção B: Railway (Alternativa)
```bash
# 1. Acesse https://railway.app
# 2. Crie novo projeto
# 3. Adicione PostgreSQL
# 4. Copie a DATABASE_URL
```

### 3. Deploy do Backend

```bash
# 1. Configurar variáveis de ambiente no Vercel
# Acesse: https://vercel.com/seu-usuario/seu-projeto/settings/environment-variables
# Adicione:
# - SECRET_KEY: uma-chave-secreta-forte-aqui
# - DATABASE_URL: postgresql://usuario:senha@host:porta/database
# - FLASK_ENV: production
# - SESSION_DURATION_HOURS: 24

# 2. Deploy do backend
vercel --prod

# 3. Anotar a URL do backend (ex: https://seu-backend.vercel.app)
```

### 4. Configuração do Frontend

```bash
# 1. Criar arquivo .env.local na raiz do projeto
echo "REACT_APP_API_URL=https://seu-backend.vercel.app/api" > .env.local

# 2. Atualizar package.json se necessário
# Verificar se tem as dependências corretas para React
```

### 5. Deploy do Frontend

```bash
# 1. Build do frontend
npm run build

# 2. Deploy do frontend
vercel --prod

# 3. Anotar a URL do frontend (ex: https://seu-site.vercel.app)
```

### 6. Teste Completo

```bash
# 1. Testar API backend
curl https://seu-backend.vercel.app/

# 2. Testar login
curl -X POST https://seu-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. Testar frontend
# Abrir https://seu-site.vercel.app no navegador
```

## 🔧 Comandos de Manutenção

### Verificar Status do Banco
```bash
# Conectar ao banco e verificar tabelas
python3 -c "
from main import app, db
from models import User, PortfolioItem
with app.app_context():
    print('Usuários:', User.query.count())
    print('Itens:', PortfolioItem.query.count())
"
```

### Criar Usuário Administrador
```bash
python3 -c "
from main import app
from auth import create_default_admin
with app.app_context():
    create_default_admin()
"
```

### Reset do Banco de Dados
```bash
python3 -c "
from main import app, db
with app.app_context():
    db.drop_all()
    db.create_all()
    print('Banco resetado!')
"
```

## 🐛 Solução de Problemas

### Erro: "Module not found"
```bash
# Instalar dependências
pip install -r requirements.txt
npm install
```

### Erro: "Database connection failed"
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
python3 -c "
import os
from sqlalchemy import create_engine
engine = create_engine(os.environ['DATABASE_URL'])
print('Conexão OK!' if engine.connect() else 'Erro de conexão')
"
```

### Erro: "CORS policy"
```bash
# Verificar se CORS está configurado em main.py
grep -n "CORS" main.py
```

### Erro: "Authentication failed"
```bash
# Verificar se usuário admin existe
python3 -c "
from main import app
from models import User
with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    print('Admin existe:', admin is not None)
"
```

## 📋 Checklist de Deploy

### Pré-Deploy
- [ ] Backup dos arquivos originais feito
- [ ] Código atualizado commitado no Git
- [ ] Dependências instaladas localmente
- [ ] Testes locais realizados

### Banco de Dados
- [ ] PostgreSQL criado (Vercel/Railway)
- [ ] DATABASE_URL copiada
- [ ] Conexão testada

### Backend
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] URL do backend anotada
- [ ] Endpoints testados

### Frontend
- [ ] .env.local criado com URL da API
- [ ] Build realizado sem erros
- [ ] Deploy realizado com sucesso
- [ ] Site acessível

### Pós-Deploy
- [ ] Login administrativo testado
- [ ] CRUD de itens testado
- [ ] Navegação testada
- [ ] Upload de arquivos testado
- [ ] Senha padrão alterada

## 🔐 Segurança

### Alterar Credenciais Padrão
```bash
# 1. Fazer login na área administrativa
# 2. Ir em "Configurações" ou usar API:

curl -X POST https://seu-backend.vercel.app/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"current_password":"admin123","new_password":"nova-senha-forte"}'
```

### Configurar SECRET_KEY Forte
```bash
# Gerar chave secreta forte
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Usar a chave gerada nas variáveis de ambiente
```

## 📞 URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com

---

**Deploy concluído com sucesso!** 🎉

Seu site agora possui:
- ✅ Sistema completo de banco de dados
- ✅ Autenticação segura
- ✅ Área administrativa funcional
- ✅ CRUD para gerenciar conteúdo
- ✅ Navegação corrigida
- ✅ Deploy em produção

