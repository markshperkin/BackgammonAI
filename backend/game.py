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
        self.borne_off_white = 0  # White checkers borne off
        self.borne_off_black = 0  # Black checkers borne off


    def initialize_board(self):
        """
        Sets up the initial backgammon board state.
        - 24 points (list of 24 elements)
        - Each point contains a list of checkers (positive for Player 1, negative for Player 2)
        """
        board = [0] * 24
        board[0] = 2
        board[5] = -5
        board[7] = -3
        board[11] = 5
        board[12] = -5
        board[16] = 3
        board[18] = 5
        board[23] = -2


        # Place 14 white checkers in white's home (indices 18–23):
        # board[18] = 1
        # board[19] = 3
        # board[20] = 3
        # board[21] = 3
        # board[22] = 2
        # board[17] = 1

        # --- Black's Checkers ---
        # board[0] = -3
        # board[1] = -3
        # board[2] = -3
        # board[3] = -3
        # board[4] = -2
        # board[6] = -1
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
        """
        Executes a move if it's legal by checking if (start, end) exists in get_all_available_moves().
        Then, it removes the corresponding dice value and updates the board state.
        """
        # Retrieve the list of all legal moves
        available_moves = self.get_all_available_moves()
        
        # Look for a move matching the given start and end
        move = None
        for m in available_moves:
            if m[0] == start and m[1] == end:
                move = m
                break
        if move is None:
            return False  # The move is not legal
        
        # Extract the required dice value and move type from the move tuple
        d = move[2]
        move_type = move[3]
        
        # Execute based on move type:
        if move_type == "re-entry":
            # For white re-entry: start should be -1, destination between 0-5.
            if self.current_player == 1:
                self.board[end] += 1
                self.bar_white -= 1
            # For black re-entry: start should be 24, destination between 18-23.
            else:
                self.board[end] += -1
                self.bar_black -= 1
            self.moves_remaining.remove(d)
        
        elif move_type == "bear_off":
            # Bearing off: remove checker from board and increment borne-off counter.
            if self.current_player == 1:
                self.board[start] -= 1
                self.borne_off_white += 1
            else:
                self.board[start] += 1  # Since black checkers are negative.
                self.borne_off_black += 1
            self.moves_remaining.remove(d)
        
        elif move_type == "normal":
            # Normal moves: update board positions and handle hitting if needed.
            piece = 1 if self.current_player == 1 else -1
            if self.current_player == 1 and self.board[end] == -1:
                self.board[end] = 0
                self.bar_black += 1
            elif self.current_player == -1 and self.board[end] == 1:
                self.board[end] = 0
                self.bar_white += 1
            self.board[end] += piece
            self.board[start] -= piece
            self.moves_remaining.remove(d)
        
        # Check for game over.
# 3. Check for game over (placeholder logic).
        winner = self.check_game_over()
        if winner:
            self.game_over = winner


        # If no moves remain or no legal moves exist, switch turn and roll new dice.
        if not self.moves_remaining or not self.can_make_any_move():
            self.current_player *= -1
            self.roll_dice()

        return True


    def check_game_over(self):
        """Check if one player has won the game (all checkers off the board) and return:
        1 if White wins, -1 if Black wins, or False if game is not over."""
        player1_checkers = sum(1 for i in self.board if i > 0)
        player2_checkers = sum(1 for i in self.board if i < 0)
        if player1_checkers == 0:
            return 1  # White wins
        elif player2_checkers == 0:
            return -1  # Black wins
        return False


    def get_board_state(self):
        # If the game is not over and the current player has no legal moves,
        # automatically switch turns and roll new dice.
        if not self.game_over and not self.can_make_any_move():
            self.current_player *= -1
            self.roll_dice()
        return {
            "board": self.board,
            "dice": self.dice,
            "moves_remaining": self.moves_remaining,
            "current_player": self.current_player,
            "game_over": self.game_over,
            "bar_white": self.bar_white,
            "bar_black": self.bar_black,
            "borne_off_white": self.borne_off_white,
            "borne_off_black": self.borne_off_black,
            "all_in_home": self.all_in_home(),
            "all_moves": self.get_all_available_moves()
        }

    
    def can_make_any_move(self):
        return len(self.get_all_available_moves()) > 0


    def all_in_home(self):
        """Return True if all checkers for the current player are in their home board and not on the bar."""
        if self.current_player == 1:
            # White: all white checkers must be on points 18-23.
            for i in range(24):
                if self.board[i] > 0 and not (18 <= i <= 23):
                    return False
            if self.bar_white > 0:
                return False
        else:
            # Black: all black checkers must be on points 0-5.
            for i in range(24):
                if self.board[i] < 0 and not (0 <= i <= 5):
                    return False
            if self.bar_black > 0:
                return False
        return True

    def get_all_available_moves(self):
        """
        Returns a list of available moves for the current player as tuples:
        (start, end, dice_value, move_type)
        where move_type is "re-entry", "normal", or "bear_off".
        
        Conditions:
        
        1. Re-entry Moves (if checkers on bar):
        For White (current_player == 1, bar_white > 0):
            - Allowed destinations: indices 0–5.
            - For each destination end in [0, 1, ..., 5]:
                * Required dice value = end + 1.
                * If that value is in moves_remaining and board[end] is not blocked (>= -1),
                add move: (-1, end, end+1, "re-entry").
        For Black (current_player == -1, bar_black > 0):
            - Allowed destinations: indices 18–23.
            - For each destination end in [18, ..., 23]:
                * Required dice value = 24 - end.
                * If that value is in moves_remaining and board[end] is not blocked (<= 1),
                add move: (24, end, 24-end, "re-entry").
        
        2. Normal Moves (if no checkers on bar):
        For each board index 'start' that holds a checker for the current player:
            For each dice value 'd' in moves_remaining:
                * For White: end = start + d.
                * For Black: end = start - d.
                * If end is within bounds and is_valid_move(start, end) is True,
                add move: (start, end, d, "normal").
        
        3. Bearing Off Moves (if all_in_home() is True):
        For White (home board indices 18–23):
            For each point 'start' in 18–23 with a white checker:
            * Required = 24 - start.
            * If required is in moves_remaining, add move: (start, 24, required, "bear_off").
            * Else, if there exists a dice value d > required AND no white checker in home
                is positioned at a lower index than 'start' (i.e. this checker is the furthest advanced),
                add move: (start, 24, d, "bear_off").
        For Black (home board indices 0–5):
            For each point 'start' in 0–5 with a black checker:
            * Required = start + 1.
            * If required is in moves_remaining, add move: (start, -1, required, "bear_off").
            * Else, if there exists a dice value d > required AND no black checker in home
                is positioned at a higher index than 'start' (i.e. this checker is the furthest advanced),
                add move: (start, -1, d, "bear_off").
        """
        moves = []

        # 1. Re-entry Moves:
        if self.current_player == 1 and self.bar_white > 0:
            for end in range(0, 6):
                d = end + 1
                if d in self.moves_remaining and self.board[end] >= -1:
                    moves.append((-1, end, d, "re-entry"))
        elif self.current_player == -1 and self.bar_black > 0:
            for end in range(18, 24):
                d = 24 - end
                if d in self.moves_remaining and self.board[end] <= 1:
                    moves.append((24, end, d, "re-entry"))

        # 2. Normal Moves (only if no checkers on bar):
        if (self.current_player == 1 and self.bar_white == 0) or (self.current_player == -1 and self.bar_black == 0):
            for start in range(24):
                if self.current_player == 1 and self.board[start] <= 0:
                    continue
                if self.current_player == -1 and self.board[start] >= 0:
                    continue
                for d in self.moves_remaining:
                    if self.current_player == 1:
                        end = start + d
                    else:
                        end = start - d
                    if 0 <= end < 24 and self.is_valid_move(start, end):
                        moves.append((start, end, d, "normal"))
        
        # 3. Bearing Off Moves:
        if self.all_in_home():
            if self.current_player == 1:
                # White home: indices 18-23.
                # Determine the furthest advanced white checker in home (lowest index)
                white_home = [i for i in range(18, 24) if self.board[i] > 0]
                furthest = min(white_home) if white_home else None
                for start in range(18, 24):
                    if self.board[start] <= 0:
                        continue
                    required = 24 - start
                    if required in self.moves_remaining:
                        moves.append((start, 24, required, "bear_off"))
                    else:
                        higher_options = [d for d in self.moves_remaining if d > required]
                        if higher_options and furthest is not None and start == furthest:
                            d = min(higher_options)
                            moves.append((start, 24, d, "bear_off"))
            elif self.current_player == -1:
                # Black home: indices 0-5.
                black_home = [i for i in range(0, 6) if self.board[i] < 0]
                furthest = max(black_home) if black_home else None
                for start in range(0, 6):
                    if self.board[start] >= 0:
                        continue
                    required = start + 1
                    if required in self.moves_remaining:
                        moves.append((start, -1, required, "bear_off"))
                    else:
                        higher_options = [d for d in self.moves_remaining if d > required]
                        if higher_options and furthest is not None and start == furthest:
                            d = min(higher_options)
                            moves.append((start, -1, d, "bear_off"))
        
        return moves
