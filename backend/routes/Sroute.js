const router = require("express").Router();
let social = require("../models/Smod");
router.route("/add").post((req,res)=>{
    const q1 = req.body.q1;
    const q2  =req.body.q2;
    const q3 =req.body.q3;
    const q4 =req.body.q4;
    const q5 = req.body.q5;
    const q6 = req.body.q6;
    const q7 = req.body.q7;
    const q8 = req.body.q8;
    const q9 = req.body.q9;
    const q10 = req.body.q10;


    const newSocial = new social({
        q1,
        q2,
        q3,
        q4,
        q5,
        q6,
        q7,
        q8,
        q9,
        q10

    })

    newSocial.save().then(()=>{
      res.json("Added")
    }).catch((err)=>{
        console.log(err);
    })



})


router.route("/").get((req,res)=>{

social.find().then((Sroute)=>{
  res.json(Sroute)

}).catch((err)=>{
    console.log(err)
})

})

router.route("/update/:id").put(async (req,res)=>{
    
   let questionId = req.params.id;
   const {q1,q2,q3,q4,q5,q6,q7,q8,q9,q10} = req.body;
   

   const updateSocial = {
     
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10

   }

   const update = await social.findByIdAndUpdate(questionId , updateSocial ).then(()=>{
    res.status(200).send({status: "Updated" })
   }).catch((err)=>{
    res.status(500).send({status: "Error with updating data" , error: err.message })

   })
    

})

router.route("/delete/:id").delete(async(req,res)=>{
  let questionId = req.params.id;
  await social.findByIdAndDelete(questionId)
  .then(()=>{
     res.status(200).send({status: "Deleted"});
  }).catch((err)=>{
    console.log(err.message);
    res.status(500).send({status: "Error with deleting",error:err.message});

  })


    
} )


router.route("/get/:id").get(async(req,res)=>{
    let questionId = req.params.id;
    const sociall = await social.findById(questionId)
    .then((social)=>{
       res.status(200).send({status: "Fetched" ,social});
    }).catch((err)=>{
      console.log(err.message);
      res.status(500).send({status: "Error with get responses",error:err.message});
  
    })
  
  
      
  } )





module.exports = router;