const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    const startIndex = req.query.start || 1; // Default to 1 if not provided

    try {
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: {
                q: searchTerm,
                cx: process.env.CX,
                searchType: 'image',
                key: process.env.API_KEY,
                start: startIndex,
                num: 10, // Maximum number of results per request (max is 10)
            },
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching images', error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
