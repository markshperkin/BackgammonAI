# API endpoints. handles API logic for user actions, game setting...
import random
from flask import Blueprint, request, jsonify
from game import Backgammon
import json
from random_ai import Rplay_ai_move  # Ensure this is imported

# from app import app


# Create a Blueprint instead of directly using `app`
game_routes = Blueprint("game_routes", __name__)
# Create a game instance
game = Backgammon()

@game_routes.route('/api/game/start', methods=['POST'])
def start_game():
    global game
    game = Backgammon()
    game.current_player = random.choice([1, -1])
    game.roll_dice()  # Roll dice to update dice and moves_remaining.
    return jsonify(game.get_board_state())


@game_routes.route('/api/game/roll-dice', methods=['GET'])
def roll_dice():
    dice = game.roll_dice()  # This method should also set game.moves_remaining appropriately
    print("dice", dice, "moves remaining:", game.moves_remaining)
    return jsonify({"dice": dice, "moves_remaining": game.moves_remaining})


@game_routes.route('/api/game/move', methods=['POST'])
def move():
    """Processes a player's move."""
    data = request.json
    start = data.get('start')
    end = data.get('end')

    if game.make_move(start, end):
        print("current board state:", game.get_board_state())
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


@game_routes.route('/api/game/ai-move', methods=['POST'])
def ai_move():
    """
    Processes an AI move for Black.
    It verifies that it’s Black’s turn, then calls play_ai_move
    (which selects a random move with delays) and returns the updated game state.
    """
    # Check that it's AI's turn (Black)
    if game.current_player != -1:
        return jsonify({"error": "Not AI's turn"}), 400

    # Call the AI function with a delay of 1 second (or adjust as needed)
    new_state = Rplay_ai_move(game, delay=1.0)
    return jsonify(new_state)
