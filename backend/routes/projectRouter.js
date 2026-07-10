import express from 'express'
import { getProjectsController, getProjectByIdController, postProjectController, putProjectController, deleteProjectController, getTechnologiesController, postTechnologyController } from '../controllers/projectController.js'

const router = express.Router()

router.get('/', getProjectsController)
router.get('/:id', getProjectByIdController)
router.post('/', postProjectController)
router.put('/:id', putProjectController)
router.delete('/:id', deleteProjectController)

export { router }