import axios from "axios";

export const getAccessToken = async (req: any, res: any) => {
    try {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: req.query.code
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 200) {
            console.log("Access token fetched successfully:", response.data.access_token);
            
            res.json({ access_token: response.data.access_token });
        } else {
            res.status(400).json({ error: response.data.error });
        }
    } catch (error: any) {
        console.error("Error fetching access token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserData = async (req: any, res: any) => {
    try {
        
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                "Authorization": req.get("Authorization") ,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (response.status === 200) {
            res.json(response.data);
        } else {
            res.status(response.status).json({ error: response.data.message });
        }
    } catch (error: any) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
