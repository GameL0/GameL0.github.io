import { messages } from '../models/messageModel.js';

export const createMessage = (data) => {
    if (!data.name || !data.email || !data.messages) {
        throw new Error("Nome, email e mensagem sao obrigatorios");
    }

    const newMessage = { ...data, readed: false};
    messages.push(newMessage);
    return newMessage;
};

export const getAllMessages = () => {
    return messages;
}