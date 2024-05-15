require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Server connected',
    data: null
  });
});

app.listen(port, () => {
  console.log(`Server is up and running at http://localhost:${port}`);
});
