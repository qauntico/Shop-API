const Product = require('../models/product');
const formidable = require('formidable')
const fs = require('fs');

exports.productId =async (req,res, next, id) => {
    await Product.findById(id).exec().then(product => {
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
      const product = new Product(fields)
      //console.log(files)
      if(files.photo){
        const photo = files.photo;
        const photoData = fs.readFileSync(photo.filepath);
        const mimeType = photo.mimetype;
        product.photo = {
            data: photoData,
            contentType: mimeType
          };
      }
      await product.save().then(res.json({message: "this was a success"})).catch(err => {
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
        .populate('category')
        .limit(limit)
        .sort([[sort, order]])
        .exec()
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.status(403).json({error: "Could Not Get Products"})
        });

};

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
        await product.save().then(result => res.json({result: result})).catch(err => res.send(err))
    }) 
};
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

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
exports.photo = (req,res, next ) => {
    if (req.product.photo.data) {
        //console.log(req.product)
        res.set("content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}
