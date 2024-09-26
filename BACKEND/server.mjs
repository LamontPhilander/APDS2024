import express from 'express';
const PORT = 3000;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.get('/test', (req, res) => {
    res.send('Testing the /test endpoint');
  })

// start the Express server
app.listen(PORT);