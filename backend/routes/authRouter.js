import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router();
router.post('/login', async (req, res) => {
    const { password } = req.body;


    if(!password) {
        return res.status(400).json({ error: 'Senha é obrigatória' })
    }

    const hashSalvo = process.env.ADMIN_PASSWORD_HASH
    const senhaCorreta = await bcrypt.compare(password, hashSalvo);

    if(!senhaCorreta){
        return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '8h'}
    );

    res.json({ token });
});

export { router };