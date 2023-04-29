export function isLoggedIn(req, res, next)
{
    if (req.session && req.session.user) 
    {
      req.user = req.session.user;
      return next();
    }
    res.redirect('/log_in_registration');
}