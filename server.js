const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('<h1 style="color:green;font-size:50px;text-align:center">🚀 VERDEX Frontend 1000+ linhas VIVO!</h1>');
});

app.listen(process.env.PORT || 10000, () => {
  console.log('🚀 VERDEX Frontend VIVO!');
});
