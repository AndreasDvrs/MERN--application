import Joi from 'joi';
import express from 'express';
import User from '../models/user';
import { signUp } from '../validations/user';
import { parseError, sessionizeUser } from "../util/helpers";


const router = express.Router();

router.post("", async (req, res) => {
  try {
    console.log('im in');

    const { username, email, password } = req.body;
    await Joi.validate({ username, email, password }, signUp);

    const newUser = new User({ username, email, password });
    const sessionUser = sessionizeUser(newUser);
    
    await newUser.save();

    req.session.user = sessionUser;
    // console.log(req.session);
    res.send({ sessionUser });
  } catch (err) {
    res.status(400).send(parseError(err));
  }
});

module.exports = router;