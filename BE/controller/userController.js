import { findByAadhar, comparePassword, createUser,  findById, updatePassword, getCandidate  , getCandidateVoteCount,submitVote} from '../models/user.js';
import {  generateToken } from '../middleware/authMiddleware.js';


const login = async (req, res) => {
    try {

        const { aadharCardNumber, password } = req.body;
        if (!aadharCardNumber || !password)
            return res.status(400).json({ error: "all fields are required" });
        const user = await findByAadhar(aadharCardNumber);
        if (!user)
            return res.status(404).json({ error: "user not found" });
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "wrong password" });

        const payload = {
            id: user.id,
            name: user.name,
            role: user.role
        };

        const token = generateToken(payload);
        res.json({
            token,
            user: { id: user.id, name: user.name, role: user.role },
            message: "successfully logged in"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const signup = async (req, res) => {
    try {
        const { name, age, email, mobile, address, aadharCardNumber, password } = req.body;

        if (!name || !age || !email || !mobile || !address || !aadharCardNumber || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (age < 18) {
            return res.status(400).json({ error: "You must be 18 or older to register" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (!/^\d{10}$/.test(mobile.toString())) {
            return res.status(400).json({ error: "Mobile number must be 10 digits" });
        }
        if (!/^\d{12}$/.test(aadharCardNumber.toString())) {
            return res.status(400).json({ error: "Aadhar number must be 12 digits" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const result = await createUser(req.body);
        res.status(201).json({ message: "user created successfully", id: result });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "User already registered with these details" });
        }
        res.status(500).json({ error: err.message });
    }

};

const getProfileData = async (req, res) => {
    try {
        const user = await findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "user does not exist" });
        }

        res.json({
            id: user.id,
            name: user.name,
            age: user.age,
            email: user.email,
            mobile: user.mobile,
            address: user.address,
            role: user.role,
            aadharCardNumber: user.aadhar_card_number,
            isVoted: Boolean(user.is_voted)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updatePass = async (req, res) => {
    try {
        const password = req.body.password
        const result = await updatePassword(password , req.user.id);

        if (!result) {
            return res.status(404).json({ error: "user does not exist" });
        }
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllCandidates = async (req, res) => {
    try {
        const result = await getCandidate();
        res.json(result || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateVote = async (req, res) => {
    try {
        const candidate_id = req.params.candidateid;
        const user_id = req.user.id;
        const result = await submitVote(user_id, candidate_id);
        if (!result) {
            return res.status(404).json({ error: "some error occurred" });
        }
        console.log(req.user)
        console.log(result)
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getVoteCount = async (req,res) => {
    try {
        const result = await getCandidateVoteCount();
        console.log(result)
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export { login, signup, getProfileData, updatePass , getAllCandidates , updateVote , getVoteCount};