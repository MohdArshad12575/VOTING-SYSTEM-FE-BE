import jwt from 'jsonwebtoken'
import { isAdmin } from '../models/user.js';

const verifyToken = (req, res, next) => {


    const authorization = req.headers.authorization

    if (!authorization) return res.status(401).json({ error: 'Token Not Found' });


    const token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded
        console.log("token verified")
        next();

    } catch (err) {
        res.status(401).json({ message: 'Invalid token', error: err.message });

    }
}


const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
}

const checkIsAdmin = async (req, res, next) => {
    try {
        const result = await isAdmin(req.user.id);
        if (!result) {
            return res.status(403).json({ error: "Admin access required" });
        }
        console.log("Admin", result, "Verified")
        next()

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });

    }
}   

export { verifyToken, generateToken, checkIsAdmin };