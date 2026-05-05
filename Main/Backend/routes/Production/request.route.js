const express = require("express");
const router = express.Router();
const {PendingRequest , acceptRequest , getALLacceptedByWoker, MyWork,completed,allCompletedWork} = require("../../controllers/Production/Request.controller");
const { verifyjwt } = require("../../Middleware/auth.middleware");

//pending 
router.get("/get-all-pending"  ,verifyjwt,  PendingRequest );


//accept
router.get("/get-all-accepted", verifyjwt ,  getALLacceptedByWoker)

router.post("/accept-request" , verifyjwt ,acceptRequest );


//work
router.get("/get-mywork" ,verifyjwt , MyWork);


//completd 
router.post("/completed" , verifyjwt , completed);

// all complted 
router.get("/my-completed" , verifyjwt , allCompletedWork)

module.exports = router;