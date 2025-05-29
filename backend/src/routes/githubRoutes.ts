import { Router } from "express";

import { getAccessToken, getUserData } from "../controller/githubController";

const router = Router();

router.get('/getAccessToken', getAccessToken);
router.get('/getUserData', getUserData); 

export default router;