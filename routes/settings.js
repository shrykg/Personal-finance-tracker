import { Router } from 'express';
const router = Router();



router.route('/profile').get(async (req, res) => {
    // Render add new transcation HTML form
    if (!req.session.user) {
      res.redirect('/login');
    }
    res.render('settings')
  }).post(async(req,res)=>{

  })

  export default router;