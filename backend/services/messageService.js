import  { getMessages, saveMessage, updateMessage, deleteMessageById, getMessageById} from '../repositories/messageRepository.js'

export async function createMessage(data){
    if(!data.name || !data.email || !data.message) {
        throw Error("Nome, Email e mensagem são obrigatórios");
    }

    return await saveMessage(data)
}

export async function listMessages(){
    return await getMessages()
}

export async function findMessage(id){
    return await getMessageById(id)
}

export async function markMessageAsRead(id){
    const message = await getMessageById(id);
    
    if(!message){
        throw Error("Messagem não encontrada");
    }
    return await updateMessage({
        id,
        name: message.name,
        email: message.email,
        message: message.message,
        read: true
    })
}

export async function deleteMessage(id){
    await deleteMessageById(id);
}