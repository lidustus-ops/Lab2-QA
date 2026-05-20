function isValidCourseId(id) {
  return /^\d+$/.test(String(id));
}

function validateCourseIdParam(req, res, next) {
  if (!isValidCourseId(req.params.id)) {
    return res.status(400).send('Invalid course id');
  }
  return next();
}

module.exports = {
  isValidCourseId,
  validateCourseIdParam,
};
