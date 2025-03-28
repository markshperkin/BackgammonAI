import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/game";

// Start a new game
export const startGame = async () => {
    try {
        const response = await axios.post(`${API_URL}/start`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to start game" };
    }
};

// Roll dice
export const rollDice = async () => {
    try {
        const response = await axios.get(`${API_URL}/roll-dice`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to roll dice" };
    }
};

// Make a move
export const makeMove = async (start, end) => {
    try {
        const response = await axios.post(`${API_URL}/move`, { start, end });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Invalid move" };
    }
};

// Get game state
export const getGameState = async () => {
    try {
        const response = await axios.get(`${API_URL}/state`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to fetch game state" };
    }
};

// Get valid moves
export const getValidMoves = async (payload) => {
    try {
      const response = await axios.post(`${API_URL}/api/game/valid-moves`, payload);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return { error: "Failed to fetch valid moves" };
    }
  };
  
