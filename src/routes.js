import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import OrderProblemController from './app/controllers/OrderProblemController';
import DeliverymanOrderController from './app/controllers/DeliverymanOrderController';
import OrderDeliveredController from './app/controllers/OrderDeliveredController';
import OrderRetrivedController from './app/controllers/OrderRetrivedController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);

routes.post('/orders/:orderId/problems', OrderProblemController.store);
routes.get('/deliveryman/:id/orders', DeliverymanOrderController.index);
routes.get('/deliveryman/:id/orders-delivered', OrderDeliveredController.index);
routes.put(
  '/orders/:orderId/end-order',
  upload.single('file'),
  OrderDeliveredController.update
);
routes.put('/orders/:orderId/start-order', OrderRetrivedController.update);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.get('/deliverymans', DeliverymanController.index);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);
routes.get('/orders/problems', OrderProblemController.index);
routes.delete(
  '/problems/:problemId/cancel-order',
  OrderProblemController.delete
);
routes.get('/orders/:orderId/problems', OrderProblemController.show);

export default routes;
