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

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: err.message,
    data: null
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: `${req.method} ${req.url} is not registered`,
    data: null
  });
});

app.listen(port, () => {
  console.log(`Server is up and running at http://localhost:${port}`);
});
