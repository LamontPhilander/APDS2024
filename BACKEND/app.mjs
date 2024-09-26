import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('HTTPS in ExpressJS');
})

    app.get('/post', (req, res) => {
        res.send('Tomato is not a fruit');
    })

export default app;