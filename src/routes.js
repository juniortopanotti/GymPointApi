import { Router } from 'express';
import multer from 'multer';

import authMiddleWare from './app/middlewares/auth';
import registerMiddleWare from './app/middlewares/register';
import studentMiddleWare from './app/middlewares/student';
import helpOrderMiddleware from './app/middlewares/helpOrder';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegisterController from './app/controllers/RegisterController';
import FileController from './app/controllers/FileController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderAdminController from './app/controllers/HelpOrderAdminController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.post(
  '/students/:id/checkins',
  studentMiddleWare,
  CheckinController.store
);
routes.get(
  '/students/:id/checkins',
  studentMiddleWare,
  CheckinController.index
);

routes.post(
  '/students/:id/help-orders',
  studentMiddleWare,
  HelpOrderController.store
);

routes.get(
  '/students/:id/help-orders',
  studentMiddleWare,
  HelpOrderController.index
);

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

routes.get('/help-orders', HelpOrderAdminController.index);

routes.put(
  '/help-orders/:id/answer',
  helpOrderMiddleware,
  HelpOrderAdminController.update
);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
