import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import CheckinController from './app/controllers/CheckinController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import AdmHelpOrderController from './app/controllers/AdmHelpOrderController';
import StudentHelpOrderController from './app/controllers/StudentHelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.get('/students/:student_id', StudentController.read);

// Daqui pra baixo somente pessoas logadas podem acessar as rotas
routes.use(authMiddleware);

// Students
routes.post('/students', StudentController.store);
routes.get('/students/', StudentController.index);
routes.put('/students/:student_id', StudentController.update);
routes.delete('/students/:student_id', StudentController.delete);

// Checkins
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

// Plans
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

// Registrations
routes.get('/registrations', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:registration_id', RegistrationController.update);
routes.delete('/registrations/:registration_id', RegistrationController.delete);

// Adm Help Orders
routes.get('/help-orders', AdmHelpOrderController.index);
routes.put('/help-orders/:help_order_id/answer', AdmHelpOrderController.update);

// Student Help Orders
routes.post(
  '/students/:student_id/help-orders',
  StudentHelpOrderController.store
);

routes.get(
  '/students/:student_id/help-orders',
  StudentHelpOrderController.index
);

export default routes;
