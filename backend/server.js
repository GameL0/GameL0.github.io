import "./config/env.js"
import express from 'express';
import cors from 'cors'
import { router as messageRouter } from './routes/messageRouter.js'
import { router as projectRouter } from './routes/projectRouter.js'
import { router as technologyRouter } from './routes/technologyRouter.js'
import { router as authRouter } from './routes/authRouter.js'

const PORT = process.env.PORT || 3000


// Middlewares
const app = express();
app.use(cors({
    origin: [
        'https://gamel0.github.io',
        'http://localhost:5173',
    ]
}))
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: "Ok"});
});

app.get('/version', (req, res) => {
    res.json({ version: "1.0.0"});
});

app.use('/auth', authRouter);
app.use('/messages', messageRouter);
app.use('/projects', projectRouter);
app.use('/technologies', technologyRouter);


app.listen(PORT, () => {
    console.log(`Executando pelo express na porta ${PORT}`)
});