import random

class Backgammon:
    def __init__(self):
        self.board = self.initialize_board()
        self.dice = (0, 0)
        self.current_player = 1  # 1 for white, -1 for black
        self.game_over = False
        self.bar_white = 0  # White checkers on the bar (jail)
        self.bar_black = 0  # Black checkers on the bar
        self.moves_remaining = []  # Will be set when dice are rolled

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
        """Rolls two dice, sets the dice attribute and the moves_remaining based on the roll."""
        die1 = random.randint(1, 6)
        die2 = random.randint(1, 6)
        self.dice = (die1, die2)
        
        # If doubles are rolled, the player gets four moves.
        if die1 == die2:
            self.moves_remaining = [die1] * 4
        else:
            self.moves_remaining = [die1, die2]
        
        return self.dice


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
        """Executes a move if it's valid, handling re-entry from the bar and normal moves."""
        
        if self.current_player == 1 and self.bar_white > 0:
            if not self.can_make_any_move():
                # Switch turn and roll new dice.
                self.current_player *= -1
                self.roll_dice()
                return True
            if start != -1:
                return False
            if not (0 <= end <= 5):
                return False
            d = end + 1
            if d not in self.moves_remaining:
                return False
            # If the destination has exactly one opposing (black) checker, hit it.
            if self.board[end] == -1:
                self.board[end] = 0
                self.bar_black += 1
            elif self.board[end] < -1:
                return False  # Blocked
            self.moves_remaining.remove(d)
            self.board[end] += 1  # White re-enters.
            self.bar_white -= 1

        elif self.current_player == -1 and self.bar_black > 0:
            if not self.can_make_any_move():
                # Switch turn and roll new dice.
                self.current_player *= -1
                self.roll_dice()
                return True
            if start != 24:
                return False
            if not (18 <= end <= 23):
                return False
            d = 24 - end
            if d not in self.moves_remaining:
                return False
            # If the destination has exactly one opposing (white) checker, hit it.
            if self.board[end] == 1:
                self.board[end] = 0
                self.bar_white += 1
            elif self.board[end] > 1:
                return False  # Blocked
            self.moves_remaining.remove(d)
            self.board[end] += -1  # Black re-enters.
            self.bar_black -= 1


        else:
            # 2. Normal move (no re-entry needed).
            if not self.is_valid_move(start, end):
                return False  # Invalid move
            
            # Determine piece value: 1 for white, -1 for black.
            piece = 1 if self.current_player == 1 else -1
            # Calculate move distance based on direction.
            distance = end - start if self.current_player == 1 else start - end
            if distance not in self.moves_remaining:
                return False
            self.moves_remaining.remove(distance)
            
            # Handle hitting: if destination has exactly one opposing checker.
            if self.current_player == 1 and self.board[end] == -1:
                self.board[end] = 0
                self.bar_black += 1
            elif self.current_player == -1 and self.board[end] == 1:
                self.board[end] = 0
                self.bar_white += 1
            
            # Execute the move.
            self.board[end] += piece
            self.board[start] -= piece

        # 3. Check for game over (placeholder logic).
        if self.check_game_over():
            self.game_over = True

        # At the end of make_move(), after processing the move:
        if not self.moves_remaining or not self.can_make_any_move():
            self.current_player *= -1
            self.roll_dice()

        return True


    def check_game_over(self):
        """Check if one player has won the game (all checkers off the board)."""
        player1_checkers = sum(1 for i in self.board if i > 0)
        player2_checkers = sum(1 for i in self.board if i < 0)
        return player1_checkers == 0 or player2_checkers == 0

    def get_board_state(self):
        """Returns the current board state as a dictionary, including bars."""
        return {
            "board": self.board,
            "dice": self.dice,
            "moves_remaining": self.moves_remaining,
            "current_player": self.current_player,
            "game_over": self.game_over,
            "bar_white": self.bar_white,
            "bar_black": self.bar_black,
        }
    
    def can_make_any_move(self):
        """
        Returns True if there is at least one legal move available for the current player,
        considering both re-entry (if any checkers are on the bar) and normal moves.
        """
        # Check re-entry moves if the current player has checkers on the bar.
        if self.current_player == 1 and self.bar_white > 0:
            # White re-entry: allowed only into indices 0-5; required dice value = end + 1.
            for end in range(0, 6):
                d = end + 1
                if d in self.moves_remaining and self.board[end] >= -1:
                    return True
            return False
        elif self.current_player == -1 and self.bar_black > 0:
            # Black re-entry: allowed only into indices 18-23; required dice value = 24 - end.
            for end in range(18, 24):
                d = 24 - end
                if d in self.moves_remaining and self.board[end] <= 1:
                    return True
            return False

        # Otherwise, check normal moves over the board.
        for start in range(24):
            # White moves: only consider points with white checkers.
            if self.current_player == 1 and self.board[start] > 0:
                for end in range(start + 1, 24):
                    distance = end - start
                    if distance in self.moves_remaining and self.is_valid_move(start, end):
                        return True
            # Black moves: only consider points with black checkers.
            elif self.current_player == -1 and self.board[start] < 0:
                for end in range(0, start):
                    distance = start - end
                    if distance in self.moves_remaining and self.is_valid_move(start, end):
                        return True
        return False

