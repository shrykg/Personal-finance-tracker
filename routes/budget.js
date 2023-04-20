import {Router} from 'express';
const router = Router();
router.route('/new').get(async (req, res) => {
    // Render add new transcation HTML form
    res.render('addbudget')
  });

export default router