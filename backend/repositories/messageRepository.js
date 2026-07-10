import { prisma } from '../config/prisma.js'

export async function getMessages(){
    return await prisma.message.findMany({
        orderBy: { id: 'asc' }
    })
}

export async function saveMessage({name, email, message}) {
    return await prisma.message.create({
        data: { name, email, message }
    })
}

export async function getMessageById(id){
    return await prisma.message.findUnique({
        where: { id: Number(id) }
    })
}

export async function deleteMessageById(id){
    return await prisma.message.delete({
        where: { id: Number(id) }
    })
}

export async function updateMessage({id, name, email, message, read}) {
    return await prisma.message.update({
        where: { id: Number(id) },
        data: { name, email, message, read }
    })
}