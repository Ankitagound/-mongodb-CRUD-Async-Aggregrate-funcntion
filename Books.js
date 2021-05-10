const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Book = require("../models/Books");

//Get method for pagination limit
router.get("/:page", (req, res, next) => {
  const limit = 2;
  console.log("page");
  const page = req.params.page;
  console.log("req.params", req.params);
  console.log(skip);
  var skip = parseInt(page);
  skip = (skip - 1) * limit;
  Book.find()
    .skip(skip)
    .limit(limit)
    .exec()
    .then((booksList) => res.status(200).json(booksList))
    .catch((err) => res.status(500).json({
      error: err
    }));
});

//Here I use Post Method for Create
router.post("/", (req, res, next) => {
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  book
    .save()
    .then((result) => console.log(result))

    .catch((err) => console.log(err));
  res.status(200).json({
    message: "New Book Item has been created",
  });
});

//Post method for pagination
router.post("/post", (req, res, next) => {
  var page = req.body.page;
  var skip = req.body.page;
  var name = req.body.name;
  var price = req.body.price;
  console.log("req.body");
  const limit = 2;
  console.log(skip);
  skip = (skip - 1) * limit;

  Book.find({}, {
      name: 1,
      price: 1
    })

    .exec()
    .then((booksList) => res.status(200).json(booksList))
    .catch((err) => res.status(500).json({
      error: err
    }));
});

// Delete method for Deleting the entries
router.delete("/:bookPrice", (req, res, next) => {
  const _price = req.params.bookPrice;
  console.log("req.params", req.params);
  Book.remove({
      price: req.params.bookPrice
    })

    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({
      error: err
    }));
  console.log("1 document deleted");
});

router.post("/update", (req, res, next) => {
  //var name = req.body.name
  //var author = req.body.author
  var objToSave = {};

  if (req.body.quotes) {
    objToSave.quotes = req.body.quotes;
  }

  if (req.body.author) {
    objToSave.author = req.body.author;
  }

  if (req.body.quantity) {
    objToSave.author = req.body.quantity;
  }

  if (req.body.index) {
    objToSave.index = req.body.index;

  }
  if (req.body.estYear) {
    objToSave.index = req.body.estYear;
  }
  Book.update({
      _id: req.body.id
    }, {
      $set: {
        author: req.body.author
      }
    })

    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({
      error: err
    }));
});

//for pipelining particular id and author

router.post("/project", (req, res, next) => {
  Book.aggregate([{
      $project: {
        _id: 1,
        author: 1
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

//for unwinding index
router.post("/unwind", (req, res, next) => {
  Book.aggregate([{
        $project: {
          name: 1,
          index: 1
        }
      },

      {
        $unwind: "$index"
      },
      {
        $match: {
          name: req.body.name
        }
      }, //to find particular name
    ])

    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({
      error: err
    }));
});

//for grouping the data:
router.post("/group", (req, res, next) => {
  Book.aggregate([{
        $group: {
          _id: "$name",
          totalPriceAmount: {
            $sum: {
              $multiply: ["$price", "$quantity"]
            }
          },
          averageQuantity: {
            $avg: "$quantity"
          },
          count: {
            $sum: 1
          },

        },
      },

      //{$limit: 3 },
      // {$skip: 5 },


    ])
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({
      error: err
    }));
});


module.exports = router;