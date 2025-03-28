import random

class Backgammon:
    def __init__(self):
        self.board = self.initialize_board()
        self.dice = (0, 0)
        self.current_player = 1  # 1 for player 1, -1 for player 2
        self.game_over = False

    def initialize_board(self):
        """
        Sets up the initial backgammon board state.
        - 24 points (list of 24 elements)
        - Each point contains a list of checkers (positive for Player 1, negative for Player 2)
        """
        board = [0] * 24
        board[0] = 2  # Player 1 (white) starts with 2 checkers on point 1
        board[5] = -5  # Player 2 (black) starts with 5 checkers on point 6
        board[7] = -3
        board[11] = 5
        board[12] = -5
        board[16] = 3
        board[18] = 5
        board[23] = -2
        return board

    def roll_dice(self):
        """Rolls two dice and returns the result."""
        self.dice = (random.randint(1, 6), random.randint(1, 6))
        return self.dice

    # def is_valid_move(self, start, end):
    #     """Checks if a move is valid based on the rules of backgammon."""
    #     if start < 0 or start >= 24 or end < 0 or end >= 24:
    #         return False  # Move is out of bounds
    #     if self.board[start] == 0:
    #         return False  # No checkers to move
    #     if (self.board[start] > 0 and self.current_player == -1) or (self.board[start] < 0 and self.current_player == 1):
    #         return False  # Can't move opponent's checkers
    #     if self.board[end] < -1 and self.current_player == 1:
    #         return False  # Player 1 cannot land on a point occupied by more than 1 Player 2 checker
    #     if self.board[end] > 1 and self.current_player == -1:
    #         return False  # Player 2 cannot land on a point occupied by more than 1 Player 1 checker
    #     return True

    def get_valid_moves(self, start):
        """Returns a list of valid destination indices for the selected checker,
        considering dice values and board rules."""
        valid_moves = []
        for end in range(24):
            if end == start:
                continue

            # Calculate move distance based on the current player's direction.
            if self.current_player == 1:
                distance = end - start  # White moves to higher indices.
            else:
                distance = start - end  # Black moves to lower indices.

            # Only consider positive move distances.
            if distance <= 0:
                continue

            # Check if the move distance matches one of the dice values.
            if distance in self.dice:
                # Call is_valid_move to further validate the move.
                if self.is_valid_move(start, end):
                    valid_moves.append(end)

        return valid_moves



    def is_valid_move(self, start, end):
        """Checks if a move is valid based on the rules of backgammon and movement direction."""
        # Check bounds
        if start < 0 or start >= 24 or end < 0 or end >= 24:
            return False  # Out of bounds

        # There must be a checker at the starting point.
        if self.board[start] == 0:
            return False

        # Ensure that the checker belongs to the current player.
        if (self.board[start] > 0 and self.current_player == -1) or (self.board[start] < 0 and self.current_player == 1):
            return False

        # Enforce movement direction:
        # White (current_player == 1) must move to a higher index.
        if self.current_player == 1 and end <= start:
            return False
        # Black (current_player == -1) must move to a lower index.
        if self.current_player == -1 and end >= start:
            return False

        # Check destination occupancy: 
        # White cannot land on a point occupied by more than one black checker.
        if self.board[end] < -1 and self.current_player == 1:
            return False
        # Black cannot land on a point occupied by more than one white checker.
        if self.board[end] > 1 and self.current_player == -1:
            return False
        return True

    def make_move(self, start, end):
        """Executes a move if it's valid."""
        if not self.is_valid_move(start, end):
            return False  # Invalid move

        # Determine piece value: 1 for white, -1 for black.
        piece = 1 if self.current_player == 1 else -1

        # Move the checker:
        # Add the piece to the destination...
        self.board[end] += piece
        # ...and remove it from the starting point.
        self.board[start] -= piece

        # Check for game over (placeholder logic)
        if self.check_game_over():
            self.game_over = True

        # Switch turns
        self.current_player *= -1
        return True




    def check_game_over(self):
        """Check if one player has won the game (all checkers off the board)."""
        player1_checkers = sum(1 for i in self.board if i > 0)
        player2_checkers = sum(1 for i in self.board if i < 0)
        return player1_checkers == 0 or player2_checkers == 0

    def get_board_state(self):
        """Returns the current board state as a dictionary."""
        return {
            "board": self.board,
            "dice": self.dice,
            "current_player": self.current_player,
            "game_over": self.game_over,
        }
