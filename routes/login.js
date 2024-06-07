const express = require('express');
const mongoose = require('mongoose');
const univModel = require('../models/user'); //대학별 모델
const router = express.Router();

router.post('/', async (req, res)=>{
    try {
        const {email, univ} = req.body;
        console.log(email);
        if(univModel(univ)){
            const userModel = univModel(univ);
            const user = await userModel.findOne({email});
            if (user) {
                return res.status(200).json({ exists: true, user });
              } else {
                return res.status(200).json({ exists: false });
              }
            }
            else {
                return res.status(400).json({ error: 'Invalid university name' });
            }
        }
        catch (error) {
            res.status(500).send(error);
        }       
    }
)

module.exports = router;