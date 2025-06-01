import Jwt  from "jsonwebtoken";

export const login = async (req: any, res: any) => {
    try {
        // Simulate user authentication
        const user = { id: 1, username: "testuser" }; // Replace with actual user retrieval logic
    
        // Generate JWT token
        const token = Jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || "default_secret", {
            expiresIn: "1h",
        });
    
        // Send response with token
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const register = async (req: any, res: any) => {
    try {
        // Simulate user registration
        const user = { id: 1, username: "newuser" }; // Replace with actual user creation logic
    
        // Generate JWT token
        const token = Jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || "default_secret", {
            expiresIn: "1h",
        });
    
        // Send response with token
        res.status(201).json({ message: "Registration successful", token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};