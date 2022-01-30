const express = require('express');
const cors = require('cors');
const todoRouter = require('./routes');

const app = express();

const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use('/api/v1/', todoRouter);
// app.get('/', (req, res) => {
//   res.send('hello');
// });

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at localhost:${PORT}`);
});
