import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseError } from 'errors';
import { getSuccessfulDeletionMessage } from 'util/constants';
import { CreateResourceRequest, UpdateResourceRequest } from 'validation/resource';
import { resourceService } from 'services';

const createResource: RequestHandler = async (req: ValidatedRequest<CreateResourceRequest>, res, next) => {
  try {
    const savedResource = await resourceService.createResource(req.body);
    res.status(201).json(savedResource);
  } catch (error) {
    next(error);
  }
};

const getResources: RequestHandler = async (req, res, next) => {
  try { 
    const resources = await resourceService.getResources({
      ...req.query,
    });
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

const getResource: RequestHandler = async (req, res, next) => {
  try {
    const resources = await resourceService.getResources({
      _id: req.params._id,
      ...req.query,
    });

    if (resources.length === 0) throw new BaseError('Resource not found', 404);
    else if (resources.length > 1) throw new BaseError('Multiple Resource entries found', 404);
    else res.status(200).json(resources[0]);
  } catch (error) {
    next(error);
  }
};

const updateResource: RequestHandler = async (req: ValidatedRequest<UpdateResourceRequest>, res, next) => {
  try {
    // ! Don't let user update protected fields
    const { title, description, value } = req.body;

    const resource = await resourceService.updateResource(req.params._id, { title, description, value });
    res.status(200).json(resource);
  } catch (error) {
    next(error);
  }
};

const deleteResource: RequestHandler = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params._id);
    res.status(200).json({ message: getSuccessfulDeletionMessage(req.params._id) });
  } catch (error) {
    next(error);
  }
};

const resourceController = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};

export default resourceController;
