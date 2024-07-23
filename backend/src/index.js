const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const postcss = require('postcss');
const postcssJs = require('postcss-js');
const fs = require('fs');

const app = express();
const port = 3001;
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/api/validate-css', upload.single('tokensFile'), async (req, res) => {
    const { cssUrl } = req.body;
    const tokensFile = req.file;

    try {
        console.log('Received request with CSS URL:', cssUrl);
        console.log('Received tokens file:', tokensFile);

        // Validate URL pattern
        const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm;
        if (!urlPattern.test(cssUrl)) {
            throw new Error('Invalid URL pattern');
        }

        const tokens = JSON.parse(fs.readFileSync(tokensFile.path, 'utf8'));
        console.log('Parsed tokens:', tokens);

        const response = await axios.get(cssUrl);
        const cssContent = response.data;
        console.log('Fetched CSS content:', cssContent);

        const root = postcss.parse(cssContent);
        const cssJson = postcssJs.objectify(root);
        console.log('Converted CSS to JSON:', cssJson);

        const missingTokens = tokens.filter(token => !Object.values(cssJson).flat().includes(token.name));
        console.log('Missing tokens:', missingTokens);

        res.json({
            missingTokens
        });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(400).json({
            error: error.message
        });
    } finally {
        // Clean up uploaded file
        if (tokensFile && tokensFile.path) {
            fs.unlinkSync(tokensFile.path);
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
