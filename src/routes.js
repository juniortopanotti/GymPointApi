import { Router } from 'express';
import multer from 'multer';

import authMiddleWare from './app/middlewares/auth';
import registerMiddleWare from './app/middlewares/register';
import studentMiddleWare from './app/middlewares/student';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegisterController from './app/controllers/RegisterController';
import FileController from './app/controllers/FileController';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleWare);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.put('/students/:id', studentMiddleWare, StudentController.update);
routes.delete('/students/:id', studentMiddleWare, StudentController.delete);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/registers', RegisterController.store);
routes.get('/registers', RegisterController.index);
routes.delete('/registers/:id', registerMiddleWare, RegisterController.delete);
routes.put('/registers/:id', registerMiddleWare, RegisterController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
