from flask import Flask, render_template, request, jsonify, send_from_directory, make_response
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Certifique-se de que o diretório 'static' existe
if not os.path.exists('static'):
    os.makedirs('static')

# Diretório para PDF (para o Resume)
if not os.path.exists('static/docs'):
    os.makedirs('static/docs')

@app.route('/')
def index():
    # Obter a preferência de tema do cookie, se existir
    theme = request.cookies.get('theme', 'light')
    return render_template('index.html', theme=theme)

@app.route('/theme', methods=['POST'])
def change_theme():
    # Endpoint para salvar preferência de tema em cookie
    try:
        theme = request.json.get('theme', 'light')
        response = make_response(jsonify({'status': 'success'}))
        response.set_cookie('theme', theme, max_age=31536000, samesite='Lax')  # válido por 1 ano
        return response
    except Exception as e:
        # Registrar erro e retornar resposta de sucesso de qualquer forma
        # (o site continuará funcionando mesmo se esta parte falhar)
        print(f"Erro ao definir cookie de tema: {e}")
        return jsonify({'status': 'success', 'note': 'Preferência temporária'})

@app.route('/resume.pdf')
def resume():
    # Retorna o arquivo PDF do currículo
    return send_from_directory('static/docs', 'resume.pdf')

@app.route('/api/contact', methods=['POST'])
def contact():
    # Endpoint para processar os dados do formulário de contato
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Aqui você pode adicionar código para enviar e-mail ou salvar os dados
        # Por exemplo, usando smtplib para enviar e-mail
        
        return jsonify({'status': 'success', 'message': 'Mensagem recebida!'})
    except Exception as e:
        print(f"Erro ao processar formulário: {e}")
        return jsonify({'status': 'error', 'message': 'Ocorreu um erro ao enviar a mensagem.'})

# Middleware para otimização de cache e segurança
@app.after_request
def add_header(response):
    # Cache estático por 1 semana
    if 'Cache-Control' not in response.headers:
        if request.path.startswith('/static/'):
            response.headers['Cache-Control'] = 'public, max-age=604800'
        else:
            response.headers['Cache-Control'] = 'no-store'
    
    # Adicionar headers de segurança
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    return response

if __name__ == '__main__':
    app.run(debug=True)
