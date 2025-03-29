import time
import random

def Rplay_ai_move(game, delay=1.0):
    """
    Executes AI moves for Black (current_player == -1) with a delay between moves.
    It selects a random move from all available moves until there are no legal moves left.
    
    Args:
        game: The Backgammon game instance.
        delay: Delay (in seconds) between moves.
    
    Returns:
        The updated board state as a dictionary.
    """
    # Ensure it is Black's turn.
    if game.current_player != -1 or game.game_over:
        return game.get_board_state()
    
    # Allow a small delay before starting AI moves.
    # time.sleep(delay)
    
    # Loop while it's still Black's turn and moves remain.
    while game.current_player == -1 and not game.game_over:
        available_moves = game.get_all_available_moves()
        if not available_moves:
            break  # No legal moves available, break out.
        # Pick a random move.
        chosen_move = random.choice(available_moves)
        start, end, dice_value, move_type = chosen_move
        
        # Delay before executing the move (simulate AI "thinking").
        # time.sleep(delay)
        
        # Execute the move via the existing make_move function.
        move_executed = game.make_move(start, end)
        print("AI move executed:", chosen_move)
        print("Updated board state:", game.get_board_state())
        
        # If no moves remain or no legal moves are possible, the turn will switch inside make_move.
        if not game.moves_remaining or not game.can_make_any_move():
            break
    
    return game.get_board_state()
