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
    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      const product = new Product(fields)
      if(files.photo){
        const photo = files.photo;
        const photoData = fs.readFileSync(photo.filepath);
        const mimeType = photo.type;
        product.photo = {
            data: photoData,
            contentType: mimeType
          };
      }
      await product.save().then(res.send("this was a success")).catch(err => {
        res.status(403).json({error: "could not save data an errored occured"})
      })
    });
};
exports.singleProduct = async (req,res) => {
    res.send(req.product)
};
exports.list =async (req,res) => {
    const limit = req.query.amount ? parseInt(req.query.amount) : 6;
    const sort = req.query.sort ? req.query.sort: 'asc';
    const id = req.query.id ? req.query.id : undefined;
    await Product.find({})
        .select('-photo')
        .populate('category')
        .limit(limit)
        .sort([[id, sort]])
        .exec()
        .then(result => {
            res.send(result)
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
exports.photo = (req,res, next ) => {
    if (req.product.photo.data) {
        res.set("content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}
