# API endpoints. handles API logic for user actions, game setting...
import random
from flask import Blueprint, request, jsonify
from game import Backgammon
# from app import app


# Create a Blueprint instead of directly using `app`
game_routes = Blueprint("game_routes", __name__)
# Create a game instance
game = Backgammon()

@game_routes.route('/api/game/start', methods=['POST'])
def start_game():
    """Starts a new game instance and randomly selects the starting player."""
    global game
    game = Backgammon()
    game.current_player = random.choice([1, -1])  # Randomly select starting player (1 for Player 1, -1 for Player 2)
    return jsonify(game.get_board_state())

@game_routes.route('/api/game/roll-dice', methods=['GET'])
def roll_dice():
    """Rolls the dice and returns the result."""
    dice = game.roll_dice()
    return jsonify({"dice": dice})

@game_routes.route('/api/game/move', methods=['POST'])
def move():
    """Processes a player's move."""
    data = request.json
    start = data.get('start')
    end = data.get('end')

    if game.make_move(start, end):
        print("current board state:", game.board)
        return jsonify(game.get_board_state())
    else:
        return jsonify({"error": "Invalid move"}), 400

@game_routes.route('/api/game/state', methods=['GET'])
def get_state():
    """Returns the current game state."""
    return jsonify(game.get_board_state())

@game_routes.route('/api/game/valid-moves', methods=['POST'])
def valid_moves():
    """Returns a list of valid destination indices for the selected checker."""
    data = request.json
    start = data.get('start')
    if start is None:
        return jsonify({"error": "Missing 'start' parameter"}), 400
    valid_moves = game.get_valid_moves(start)
    return jsonify({"valid_moves": valid_moves})
