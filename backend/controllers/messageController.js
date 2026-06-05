import * as messageService from '../services/messageService.js'

export const postMessage = (req, res) => {
    console.log("O que chegou no body:", req.body);
    try {
        const result = messageService.createMessage(req.body);
        res.status(201).json(result);
    } catch (error){
        res.status(400).send(error.message);
    }
};

export const getMessages = (req, res) => {
    const result = messageService.getAllMessages();
    res.json(result);
};