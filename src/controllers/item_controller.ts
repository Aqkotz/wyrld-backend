import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseError } from 'errors';
import { getSuccessfulDeletionMessage } from 'util/constants';
import { CreateItemRequest, UpdateItemRequest } from 'validation/item';
import { itemService } from 'services';

const createItem: RequestHandler = async (req: ValidatedRequest<CreateItemRequest>, res, next) => {
  try {
    const savedItem = await itemService.createItem(req.body);
    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
};

const getItems: RequestHandler = async (req, res, next) => {
  try { 
    const items = await itemService.getItems({
      ...req.query,
    });
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const getItem: RequestHandler = async (req, res, next) => {
  try {
    const items = await itemService.getItems({
      _id: req.params._id,
      ...req.query,
    });

    if (items.length === 0) throw new BaseError('Item not found', 404);
    else if (items.length > 1) throw new BaseError('Multiple Item entries found', 404);
    else res.status(200).json(items[0]);
  } catch (error) {
    next(error);
  }
};

const updateItem: RequestHandler = async (req: ValidatedRequest<UpdateItemRequest>, res, next) => {
  try {
    // ! Don't let user update protected fields
    const { name, description } = req.body;

    const item = await itemService.updateItem(req.params._id, { name, description });
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

const deleteItem: RequestHandler = async (req, res, next) => {
  try {
    await itemService.deleteItem(req.params._id);
    res.status(200).json({ message: getSuccessfulDeletionMessage(req.params._id) });
  } catch (error) {
    next(error);
  }
};

const itemController = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};

export default itemController;
