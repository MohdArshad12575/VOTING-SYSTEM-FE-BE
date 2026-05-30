import express from 'express';
import {addCandidate ,upCandidate , delCandidate } from '../controller/adminController.js';
import { verifyToken, checkIsAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", verifyToken, checkIsAdmin, addCandidate)
router.put("/update/:id", verifyToken, checkIsAdmin, upCandidate)
router.delete("/delete/:id", verifyToken, checkIsAdmin, delCandidate)

export default router;