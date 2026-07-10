import { prisma } from '../config/prisma.js'

export async function getAllProjects(){
    return await prisma.project.findMany({
        orderBy: { order: 'asc' },
        include: { technologies: true }
    })
}

export async function getProjectById(id){
    return await prisma.project.findUnique({
        where: { id: Number(id) },
        include: { technologies:true }
    })
}

export async function createProject({name, description, link, imageUrl, order, technologies}) {
    return await prisma.project.create({
        data: {
            name,
            description,
            link,
            imageUrl,
            order: order ?? 0,
            technologies: {
                connect: technologies?.map(id => ({ id: Number(id) })) ?? []
            }
        },
        include: {technologies: true}
    })
}

export async function updateProject({id, name, description, link, imageUrl, order, technologies}) {
    return await prisma.project.update({
        where: { id: Number(id) },
        data: {
            name,
            description,
            link,
            imageUrl,
            order,
            technologies: {
                set: technologies?.map(id => ({ id: Number(id) })) ?? []
            }
        },
        include: { technologies: true }
    })
}

export async function deleteProject(id){
    return await prisma.project.delete({
        where: {id: Number(id)}
    })
}

export async function getAllTechnologies() {
    return await prisma.technology.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function createTechnology({name, iconUrl}) {
    return await prisma.technology.create({
        data: { name, iconUrl}
    })
}