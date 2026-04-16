import { Router } from 'express';
import { changeStatus } from './admin.service.js';
import Validation from '../../middlewares/auth.validation.js';
import { changeStatusValidation } from './admin.validation.js';
import successResponse from '../../utils/responses/success.response.js';

const adminRouter = Router();
adminRouter.patch(
  '/change-status',
  Validation(changeStatusValidation),
  async (req, res, next) => {
    const account = await changeStatus(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'status changed',
      data: { account },
    });
  },
);
export default adminRouter;
