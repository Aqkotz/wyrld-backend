import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import { itemController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateItemSchema, UpdateItemSchema } from 'validation/item';
import { SCOPES } from 'auth/scopes';

const router = express();
const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

// find and return all items
router.route('/')
  .post(
    requireScope(SCOPES.USER.name),
    validator.body(CreateItemSchema),
    itemController.createItem,
  )
  .get(
    requireScope(SCOPES.USER.name),
    itemController.getItems,
  );

router.route('/:id')
  .get(
    requireScope(SCOPES.USER.name),
    itemController.getItem,
  )
  .patch(
    requireScope(SCOPES.USER.name),
    validator.body(UpdateItemSchema),
    itemController.updateItem,
  )
  .delete(
    requireScope(SCOPES.USER.name),
    itemController.deleteItem,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;