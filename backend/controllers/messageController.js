import * as z from "zod";
import {createMessage, listMessages, markMessageAsRead, deleteMessage} from '../services/messageService.js'

const PostMessageControllerBody = z.object({
    name: z.string(),
    email: z.email(),
    message: z.string(),
});


export const postMessageController = async (req, res) => {
    try{
        const data = PostMessageControllerBody.parse(req.body);
        const messageId = await createMessage(data);
        res.json({ status: "ok", messageId})

    } catch (err) {
        if (err.name == "ZodError"){
            const message = JSON.parse(err.message);
            res.status(400).send(`Erro de validação: ${message[0].message}`)
            return
        }
        console.log(err)
        res.status(400).send(err.message);
        return
    }
}

export const getMessagesController = async (req, res) => {
    try{
        const messages = await listMessages();
        res.json(messages)
    } catch (err){
        res.status(400).send(err.message);
        return
    }
    
}

export const patchMessagesController = async (req, res) => {

    try{
        const updatedMessage = await markMessageAsRead(req.params.id);
        res.json(updatedMessage);
    } catch (err) {
        res.status(400).send(err.message);
        return
    }
    
}

export const deleteMessagesController = async (req, res) => {
    try{
        await deleteMessage(req.params.id);
        res.json({ status:"ok" });
    } catch (err) {
        res.status(400).send(err.message);
        return
    }
}