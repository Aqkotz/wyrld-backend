import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import { resourceController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateResourceSchema, UpdateResourceSchema } from 'validation/resource';
import { SCOPES } from 'auth/scopes';

const router = express();
const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

// find and return all resources
router.route('/')
  .post(
    requireScope(SCOPES.USER.name),
    validator.body(CreateResourceSchema),
    resourceController.createResource,
  )
  .get(
    requireScope(SCOPES.USER.name),
    resourceController.getResources,
  );

router.route('/:id')
  .get(
    requireScope(SCOPES.USER.name),
    resourceController.getResource,
  )
  .patch(
    requireScope(SCOPES.USER.name),
    validator.body(UpdateResourceSchema),
    resourceController.updateResource,
  )
  .delete(
    requireScope(SCOPES.USER.name),
    resourceController.deleteResource,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
