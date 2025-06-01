import Jwt  from "jsonwebtoken";
import { prisma } from "../globle";
import bcrypt from "bcrypt";


export const login = async (req: any, res: any) => {
    try {
        // Simulate user authentication

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        

        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        

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
        
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        });

        // Generate JWT token
        const token = Jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET || "default_secret", {
            expiresIn: "1h",
        });

        // Send response with token
        res.status(201).json({ message: "Registration successful", token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};