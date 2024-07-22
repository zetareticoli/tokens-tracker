const express = require('express');
const multer = require('multer');
const axios = require('axios');
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Function to analyze CSS content
const analyzeCSS = async (cssContent) => {
  const root = postcss.parse(cssContent);
  const tokens = {};

  root.walkDecls((decl) => {
    if (decl.value.startsWith('var(--')) {
      const token = decl.value.match(/var\(--(.+?)\)/)[1];
      tokens[token] = (tokens[token] || 0) + 1;
    }
  });

  return tokens;
};

// Route to handle file upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const cssContent = fs.readFileSync(filePath, 'utf8');
  const tokens = await analyzeCSS(cssContent);
  res.json(tokens);
});

// Route to handle URL scanning
app.post('/api/scan', async (req, res) => {
  const { url } = req.body;
  try {
    console.log(`Fetching CSS from URL: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log(`Status Code: ${response.status}`);
    console.log(`Response Headers: ${JSON.stringify(response.headers)}`);
    const cssContent = response.data;
    const tokens = await analyzeCSS(cssContent);
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching CSS from URL:', error.message);
    if (error.response) {
      console.error(`Status Code: ${error.response.status}`);
      console.error(`Response Data: ${error.response.data}`);
    }
    res.status(500).send('Error fetching CSS from URL');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
