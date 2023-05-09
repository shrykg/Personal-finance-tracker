import { Router } from 'express';
const router = Router();
import { update_user_name, update_user_last_name, update_user_dob, update_password } from '../data/settings.js';
import validation from '../validation.js'
import xss from 'xss'

router.route('/profile').get(async (req, res) => {
  // Render add new transcation HTML form
  let data = req.session.user;
  console.log(data);
  if (!req.session.user) {
    return res.redirect('/login');
  }
  return res.render('settings', { data: data })
}).post(async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  let data = req.session.user;

  let user_name = xss(req.body.firstname);
  user_name = user_name.trim();
  try {
    validation.validateFirstName(user_name);
  }
  catch (e) {
    return res.status(400).render('settings', { data: data, error_server: e })
  }

  let last_name = xss(req.body.lastname);
  last_name = last_name.trim();

  try {
    validation.validateLastName(last_name);
  }
  catch (e) {
    return res.status(400).render('settings', { data: data, error_server: e })
  }

  let dob = xss(req.body.dob);

  try {
    let age = validation.validateDOB(dob);
    if (age < 13) {
      throw ('Age cannot be less than 13')
    }
  }
  catch (e) {
    return res.status(400).render('settings', { data: data, error_server: e })
  }
  if (data.firstname !== user_name) {
    data.firstname = user_name;
    try {
      await update_user_name(data.id, user_name);
    }
    catch (e) {
      return res.status(400).render('settings', { data: data, error_server: e })
    }
  }
  // else {
  //   return res.status(400).render('settings', { data: data, error_server: 'Username cannot be the same as before' })
  // }
  if (data.lastname !== last_name) {
    data.last_name = last_name;
    try {
      await update_user_last_name(data.id, last_name);
    }
    catch (e) {
      return res.status(400).render('settings', { data: data, error_server: e })
    }

  }
  // else {
  //   return res.status(400).render('settings', { data: data, error_server: 'Lastname cannot be the same as before' })
  // }
  if (data.dob !== dob) {
    data.dob = dob;
    try {
      await update_user_dob(data.id, dob);
    }
    catch (e) {
      return res.status(400).render('settings', { data: data, error_server: e })
    }
  }
  // else {
  //   return res.status(400).render('settings', { data: data, error_server: 'DOB cannot be the same as before' })
  // }
  //if (data.firstname === username && data.lastname === last_name)

  return res.status(500).render('settings', { data: data, error_server: 'Success in updating values !' });
})


router.route('/changepassword').get(async (req, res) => {
  // Render add new transcation HTML form
  let data = req.session.user;
  let success = '';
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
  let old_password = req.body.current_pwd;
  let new_password = req.body.new_pwd;
  let confirm_new_password = req.body.confirm_new_pwd;

  if (new_password !== confirm_new_password) {
    return res.render('changepassword', { error_server: "New passwords must match" });
  }
  try {
    await update_password(data.id, old_password, new_password);
    return res.render('settings', { data: data });
  }
  catch (e) {
    return res.status(400).render('changepassword', { error_server: e });
  }


})
export default router;