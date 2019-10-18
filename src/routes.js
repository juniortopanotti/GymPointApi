import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

import authMiddleWare from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleWare);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

export default routes;
