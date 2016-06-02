const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session : false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app){

  app.get('/api/secret', requireAuth, function(req, res){

    res.send({ message: 'super Secret code 8675309'});
  });
  app.post('/api/signin', requireSignin, Authentication.signin);
  app.post('/api/signup', Authentication.signup);
  app.get('/api/signout', function (req, res){
    console.log("LOGING OUT!!!");
    res.json({ message: "signedOut"})
  });
  app.get('/test', function(req, res){
    res.send({message: 'This is a test'});
  })

}
