from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Esta rota responderá a QUALQUER requisição (/, /login, etc.)
    print("Requisição recebida com sucesso!")
    return jsonify({"message": "Servidor Flask está no ar e funcionando!", "path_acessado": f"/{path}"}), 200

# O if __name__ == "__main__": não é necessário para a Vercel, 
# ela executa o objeto 'app' diretamente.