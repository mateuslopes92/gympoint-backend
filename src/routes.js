import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Daqui pra baixo somente pessoas logadas podem acessar as rotas
routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.put('/students/:student_id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

export default routes;
