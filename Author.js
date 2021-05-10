const { reject } = require("async");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Author = require("../models/Author");
const Book = require("../models/Books");
const { route } = require("./Books");


//Get method:
router.get('/', (req, res, next) => {

   Author.find()
   .exec()
    .then((booksList) => res.status(200).json(booksList))
    .catch((err) => res.status(500).json({
     error: err
   }));

});

//for using Post method so that we cna add data into that
router.post('/', (req, res, next) => {

  const author = new Author({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    desc: req.body.desc
  });
  author
    .save()
    .then((result) => console.log(result))

    .catch((err) => console.log(err));
  res.status(200).json({
    message: "New Author has been created",
  });
});

router.post('/lookup', (req, res, next) => {

  Book.aggregate([{
      $lookup: {
        from: "authors",
        localField: "author",
        foreignField: "_id",
        as: "book_docs"
      }
    }])
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({
      error: err
    }));

});

router.post('/async', (req, res, next) => {

    
    //   async.waterfall([
    //     function(callback) {
    //         callback("error", 'one', 'two');
    //     },
    //     function(arg1, arg2, callback) {
    //         // arg1 now equals 'one' and arg2 now equals 'two'
    //         console.log("arg1" ,arg1 , "arg2" , arg2)
    //         callback(null, 'three');
          
    //     }, 
    //     function(arg1, callback) {
    //         // arg1 now equals 'three'
    //         console.log("arg1" , arg1)
    //         callback(null, 'done');
    //     }
    // ], function (err, result) {
    //     // result now equals 'done'
    //     console.log("err" , err , "result" , result)
    // });


    // var count = 0;
    // async.whilst(
    //     function test(cb) {
    //       console.log("count1" , count)
    //       cb(null, count < 5); },
    //     function iter(callback) {
    //         count++;
    //         console.log("count2" , count)
    //         setTimeout(function() {
    //             callback(null, count);
    //         }, 1000);
    //     },
    //     function (err, n) {
    //         // 5 seconds have passed, n = 5
    //         console.log("err" , err ,"n" , n)
    //     }
    // );

    //async groupBy static code
  //      async.groupBy([
  //      {
  //          name:"user1",
  //          age:20,
  //          gender:"male"
  //      },
  //     {
  //         name:"user2",
  //         age:25,
  //         gender:"female"
  //    },
  //      {

  //          name:"user3",
  //          age: 30,
  //         gender: "male"
  //      }
  //  ] ,function(userId, callback) {
  //    callback(null , userId.gender)
      

  //  }, function(err, result) {
  //      // result is object containing the userIds grouped by age
  //      // e.g. { 30: ['userId1', 'userId3'], 42: ['userId2']};
  //      console.log(err , result)
  //         res.json(result)
  //  });

  
   //groupBy Dynamic code:
  // Book.find({} , function(err,name){
  //   async.groupBy (name , function(book , callback){
  //     callback(null , book.author)
  //   }, function(error , data) {
  //       console.log(error , data) 
  //       res.json(data) 
  //    }  
  //   ,)
  // });


 // async await and async promise  
  //a promise
  let promise = new Promise(function(resolve , reject){
    setTimeout(function(){
      resolve("Promise resolved")} , 1000);
    });

    //async function
    async function asyncFunc()
    {
      //wait until the promise is resolves
      let result = await promise;

      console.log(result);
      console.log('hey! my name is Ankita');
    }

    //calling the async function
    asyncFunc();
});


module.exports = router;