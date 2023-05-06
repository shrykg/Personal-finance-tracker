import { Router } from 'express';
const router = Router();
import { update_user_name, update_user_last_name, update_user_dob, update_password } from '../data/settings.js';

router.route('/profile').get(async (req, res) => {
  // Render add new transcation HTML form
  let data = req.session.user;
  console.log(data);
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('settings', { data: data })
}).post(async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  let data = req.session.user;
  let user_name = req.body.firstname;
  let last_name = req.body.lastname;
  let dob = req.body.dob;

  if (data.firstname !== user_name) {
    data.firstname = user_name;
    await update_user_name(data.id, user_name);
  }
  if (data.lastname !== last_name) {
    data.last_name = last_name;
    await update_user_last_name(data.id, last_name);
  }
  if (data.dob !== dob) {
    data.dob = dob;
    await update_user_dob(data.dob, dob);
  }

  console.log('Success in updating values !');
})


router.route('/changepassword').get(async (req, res) => {
  // Render add new transcation HTML form
  let data = req.session.user;
  //console.log(data);
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('changepassword', { data: data })
}).post(async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  let data = req.session.user;
  console.log(data)
  let old_password = req.body.current_pwd;
  let new_password = req.body.new_pwd;
  console.log(old_password);
  console.log(new_password);
  try {
    await update_password(data.id, old_password, new_password);
    console.log('Password updated !')

  }

  catch (e) {

  }


})
export default router;