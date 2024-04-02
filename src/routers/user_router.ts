import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireSelf from 'auth/requireSelf';
import { userController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateUserSchema, UpdateUserSchema } from 'validation/users';
import { SCOPES } from 'auth/scopes';

const router = express();
const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

router.route('/')
  .get(
    requireScope(SCOPES.ADMIN.name),
    userController.getUsers,
  )
  .post(
    requireScope(SCOPES.ADMIN.name),
    validator.body(CreateUserSchema),
    userController.createUser,
  );

router.route('/:_id')
  .get(
    requireScope(SCOPES.USER.name),
    requireSelf(SCOPES.ADMIN.name),
    userController.getUser,
  )
  .patch(
    requireScope(SCOPES.USER.name),
    requireSelf(SCOPES.ADMIN.name),
    validator.body(UpdateUserSchema),
    userController.updateUser,
  )
  .delete(
    requireScope(SCOPES.USER.name),
    requireSelf(SCOPES.ADMIN.name),
    userController.deleteUser,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
