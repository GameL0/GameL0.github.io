import express from 'express';
import messageRoutes from './routes/messageRoutes.js'

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: "Ok"});
});

app.get('/version', (req, res) => {
    res.json({ status: "1.0.0"});
});

app.use('/messages', messageRoutes);

app.listen(3000, () => {
    console.log("Executando pelo express na porta 3000.");
})