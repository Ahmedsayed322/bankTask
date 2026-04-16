const successResponse = (
  res,
  {statusCode = 200,
  message = 'done',
  data = undefined,}
) => {
  res.status(statusCode).json({ message, ...data });
};
export default successResponse;
