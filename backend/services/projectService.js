import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getAllTechnologies, createTechnology} from '../repositories/projectRepository.js'

export async function listProjects() {
    return await getAllProjects();
}

export async function findProjectById(id){
    const project = await getProjectById(id);
    if (!project) {
        throw new Error(`Project with ID ${id} not found`);
    }
    return project;
}

export async function addProject(data) {
    if (!data.name || !data.description) {
        throw new Error('Project name and description are required');
    }
    return await createProject(data);
}

export async function editProject(id, data) {
    await findProjectById(id);
    return await updateProject({ id, ...data });
}

export async function removeProject(id) {
    await findProjectById(id);
    return await deleteProject(id);
}

export async function listTechnologies() {
    return await getAllTechnologies();
}

export async function addTechnology(data) {
    if (!data.name) {
        throw new Error('Technology name is required');
    }
    return await createTechnology(data);
}
