exports.notFound = function notFound(req, res, next) {
  console.log('You seem lost. You must have taken a wrong turn back there.');
  res.redirect('/');
};

exports.error = function error(err, req, res, next) {
  console.log(err);
  res.status(500).send('Something broke. What did you do?');
};