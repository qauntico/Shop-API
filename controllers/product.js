const Product = require('../models/product');
const formidable = require('formidable');
const {  validationResult } = require('express-validator');
const fs = require('fs');
const _ = require('lodash');
const {errorHandler } = require('../Helpers/errorhandler');

exports.productId =async (req,res, next, id) => {
    await Product.findById(id)
        .populate('category')//method in Mongoose is used to populate referenced documents in a query result. It allows you to retrieve additional data from other collections that are referenced by a field in the queried documents
        .exec().then(product => {
        req.product = product;
        next();
    }).catch(err => {
        res.status(403).json({error: "Product wasn't found"})
    });
}

exports.create = (req,res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({error: err})
        console.log(err)
        return;
      }
      //api validation
      if(!fields.name){
        return res.status(400).json({error: 'There is No Event Name How Will People Identify What Event It is'})
      }
      if(!fields.price){
        return res.status(400).json({error: 'What Are The Ticket Prices For Your Event '})
      }
      if(!fields.description){
        return res.status(400).json({error: 'Describe Your Event So That People Can Know'})
      }
      if(!fields.category){
        return res.status(400).json({error: 'The Category For Your Event Was not Selected'})
      }
      if(!fields.endTime){
        return res.status(400).json({error: 'What Is The Estimated Time For This Event To End'})
      }
      if(!fields.startTime){
        return res.status(400).json({error: 'At What Time Does Your Event Start'})
      }
      if(!fields.startDate){
        return res.status(400).json({error: 'What Is The Start Date For Your Event'})
      }
      if(!fields.location){
        return res.status(400).json({error: 'Location For This Event ? .....'})
      }
      if(!fields.quantity){
        return res.status(400).json({error: 'What Is The Quantity Of Tickets Available For This Event'})
      }
      if(!files.photo){
        return res.status(400).json({error: 'Add A Image For Your Event '})
      }
      const product = new Product(fields)
      if(files.photo){
        const photo = files.photo;
        const photoData = fs.readFileSync(photo.filepath);
        const mimeType = photo.mimetype;
        product.photo = {
            data: photoData,
            contentType: mimeType
          };
      }
      await product.save().then(
            res.json({success: "Event Was Succesfully Created"})
        )
        .catch(err => {
        res.status(403).json({error: "could not save data an errored occured"})
      })
    });
};
exports.singleProduct = async (req,res) => {
    res.send(req.product)
};
exports.list =async (req,res) => {
    const limit = req.query.amount ? parseInt(req.query.amount) : 6;
    const sort = req.query.sort ? req.query.sort: '_id';
    let order = req.query.order ? req.query.odrer : 'desc' ;
    await Product.find({})
        .select('-photo')
        .populate('category')//the populate is use to 
        .limit(limit)
        .sort([[sort, order]])
        .exec()
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.status(403).json({error: "Could Not Get Products"})
        });

};
//update product controller
exports.update = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.parse(req,async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                err: "image could not be uploaded"
            })
        }
      
        let product = req.product;
        //the extend is a lodash method that helps update entries in the database it takes the previous object and new object
        product = _.extend(product, fields);
        if (files.photo){
            //fs is used to have acces to the file system.
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;

        }
        await product.save().then(result => res.json({success: 'Event Was Successfully Updated..'})).catch(err => res.status(403).json({error: 'Could Not Update Event An Error Occurred Try Again Later'}))
    }) 
};
//the sort controller
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec().then(data => {
            res.json({
                size: data.length,
                data
            });
        }).catch(err => {
            res.status(403).json({error: "product not found"})
        })
};
//send product photo
exports.photo = (req,res, next ) => {
    if (req.product.photo.data) {
        //console.log(req.product)
        res.set("content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

//the search controller 
exports.listSearch =async (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        //the option 'i' means  that mongoose should not check cases 
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        await Product.find(query)
        .select('-photo')
        .then(products => {
            res.json(products)
        }).catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        })
    }
};

//it will find the products base on the request product category 
exports.listRelated = async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit): 10;
    const data = await Product.find({_id: {$ne: req.product._id}, category: req.product.category})
        .select("-photo")
        .limit(limit)
        //here we are specifying that we want only the _id and name to be populated into the product product querry from the 
        //category document 
        .populate("category", "_id name")
        .exec()
        .catch(err => {
            res.status(400).json({error: err})
        });
    res.send(data);  
};

exports.listCategories = async (req, res ) => {
    Product.distinct('category', {}).then(products => res.json(products)).catch(err => res.send(err))
};

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }//In Mongoose and MongoDB, the $inc operator is used in update queries to increment or decrement the value of a field in a document.
            }
        };
    });

    Product.bulkWrite(bulkOps, {}).catch(error => {
        res.send(error)
    });
    next();
};