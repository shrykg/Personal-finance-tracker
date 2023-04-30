import { Router } from 'express';
const router = Router();




router.route('/profile').get(async (req, res) => {
  // Render add new transcation HTML form
  let data = req.session.user;
  console.log(data);
  if (!req.session.user) {
    res.redirect('/login');
  }
  res.render('settings', { data: data })
}).post(async (req, res) => {

})

export default router;