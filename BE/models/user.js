import pool from '../db.js';
import bcrypt from 'bcrypt';

const createUser = async (userData) => {
    const { name, age, email, mobile, address, aadharCardNumber, password } = userData;
    const hashedPassword = await bcrypt.hash(password,10);
    const [result] = await pool.query(
        `INSERT INTO users (name, age, email, mobile, address, aadhar_card_number, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, age, email, mobile, address, aadharCardNumber, hashedPassword]
    );
    return result.insertId;
};

const findByAadhar = async (aadharCardNumber) => {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE aadhar_card_number = ?`,
        [aadharCardNumber]
    );
    return rows[0];
};

const findById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
};

const isAdmin = async (userId) => {
    const [rows] = await pool.query(
        `SELECT id, name 
         FROM users 
         WHERE id = ? AND role = 'admin' 
         LIMIT 1`,
        [userId]
    );
    if (rows.length > 0) {
        return rows[0]; 
    }
};


const submitVote = async (userId, candidateId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [userRows] = await connection.query(
            'SELECT * FROM users WHERE id = ? AND role = "voter" AND is_voted = 0',
         [userId]);

         if(userRows.length === 0) {
            throw new Error('User is not a voter or has already voted');
         };

        const [candidateRows] = await connection.query(
            'SELECT * FROM candidates WHERE id = ?',
         [candidateId]);

        if(candidateRows.length === 0) {
            throw new Error('Candidate not exists');
        };

        // mark user as voted
        await connection.query(
            'UPDATE users SET is_voted = 1 WHERE id = ?',[userId]
        );

        // insert vote record in separate table 
         await connection.query(
            'INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)',
            [userId, candidateId]
        );
        // updating vote count for candidate
        await connection.query(
            `UPDATE candidates SET vote_count = vote_count + 1 WHERE id = ?`,
            [candidateId]
        );

        await connection.commit();
        return { success: true, message: "Vote recorded successfully" };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getCandidate = async () => {
    const [rows] = await pool.query(`SELECT * FROM candidates`);
    return rows;
};

const getCandidateVoteCount = async () => {
    const [rows] = await pool.query(`SELECT name, vote_count FROM candidates`);
    return rows;
};

const updatePassword = async (password, id) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, id]);
    return result.affectedRows > 0;
};

const comparePassword = async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};



export { createUser, findByAadhar, findById, comparePassword, isAdmin, updatePassword , getCandidate  , getCandidateVoteCount, submitVote};