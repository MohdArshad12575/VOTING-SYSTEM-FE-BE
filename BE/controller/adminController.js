import { createCandidate , updateCandidate , deleteCandidate} from '../models/admin.js';

const addCandidate = async (req, res) => {
    const CandidateData = req.body;
    try {
        const result = await createCandidate(CandidateData)
        if (!result) {
            return res.status(404).json({ error: "candidate does not updated" });
        }
        res.json({message: "successfully updated candidate record "});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const upCandidate = async (req, res) => {
    const CandidateData = req.body;
    const id = req.params.id;
    try {
        const result = await updateCandidate(CandidateData,id)
        if (!result) {
            return res.status(404).json({ error: "Candidate not found or no fields to update" });
        }
        console.log(result)
        res.json({message: "successfully updated candidate record "});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const delCandidate = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await deleteCandidate(id)
        if (!result) {
            return res.status(404).json({ error: "candidate does not deleted" });
        }
        console.log(result)
        res.json({message: "successfully deleted candidate record "});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export { addCandidate, upCandidate, delCandidate };