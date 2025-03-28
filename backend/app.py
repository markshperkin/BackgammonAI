# main flask app. entry point of the backend. 
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

# Initialize Flask app
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Import and register Blueprints **after** initializing app
from routes import game_routes
app.register_blueprint(game_routes)

@app.route('/')
def home():
    return {"message": "Backgammon API is running!"}

# Run the server
if __name__ == '__main__':
    socketio.run(app, debug=True)

