import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

import authMiddleWare from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegisterController from './app/controllers/RegisterController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleWare);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/registers', RegisterController.store);
routes.get('/registers', RegisterController.index);
routes.delete('/registers/:id', RegisterController.delete);
routes.put('/registers/:id', RegisterController.update);

export default routes;
