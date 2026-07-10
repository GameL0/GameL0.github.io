import * as z from 'zod'
import { listProjects, findProjectById as findProject, addProject, editProject, removeProject, listTechnologies, addTechnology } from '../services/projectService.js'

const ProjectBody = z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().optional(),
    imageUrl: z.string().optional(),
    order: z.number().optional(),
    technologies: z.array(z.number()).optional()
})

const TechnologyBody = z.object({
    name: z.string(),
    iconUrl: z.string().optional()
})

export const getProjectsController = async (req, res) => {
    try {
        const projects = await listProjects()
        res.json(projects)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

export const getProjectByIdController = async (req, res) => {
    try {
        const project = await findProject(req.params.id)
        res.json(project)
    } catch (err) {
        res.status(404).send(err.message)
    }
}

export const postProjectController = async (req, res) => {
    try {
        const data = ProjectBody.parse(req.body)
        const project = await addProject(data)
        res.status(201).json(project)
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).send(`Erro de validação: ${err.errors[0].message}`)
        }
        res.status(400).send(err.message)
    }
}

export const putProjectController = async (req, res) => {
    try {
        const data = ProjectBody.parse(req.body)
        const project = await editProject(req.params.id, data)
        res.json(project)
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).send(`Erro de validação: ${err.errors[0].message}`)
        }
        res.status(400).send(err.message)
    }
}

export const deleteProjectController = async (req, res) => {
    try {
        await removeProject(req.params.id)
        res.json({ status: 'ok' })
    } catch (err) {
        res.status(400).send(err.message)
    }
}

export const getTechnologiesController = async (req, res) => {
    try {
        const technologies = await listTechnologies()
        res.json(technologies)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

export const postTechnologyController = async (req, res) => {
    try {
        const data = TechnologyBody.parse(req.body)
        const technology = await addTechnology(data)
        res.status(201).json(technology)
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).send(`Erro de validação: ${err.errors[0].message}`)
        }
        res.status(400).send(err.message)
    }
}
