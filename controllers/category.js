const Category = require('../models/category');
//create a category
exports.create = async (req,res) => {
    const category = new Category(req.body);
    await category.save().then(result => {
        res.send(result);
    }).catch(err => {
        res.status(403).json({error: "could not create category"});
    });
};
//list out categories 
exports.list = async (req,res) => {
    await Category.find({}).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(403).json({err: "Could not get products"})
    })
};
//send out a single category
exports.category = async (req,res) => {
    res.send(req.category);
};
//update a single category
exports.update = async (req, res) => {
    console.log(req.body)
    await Category.findOneAndUpdate({name: req.category.name}, { $set: req.body})
        .then(result => {
        res.send(result)
    }).catch(err => {
        res.status(403).json({error: "could not update that category"});
    })
};
//remove a category 
exports.remove = async (req,res) => {
    await Category.findOneAndDelete({name: req.category.name})
        .then(res.send('this was a success'))
        .catch(err => {
            res.status(403).json({error: err})
        })
};

//category id
exports.categoryId = async (req,res, next ,id) => {
    await Category.findById(id).exec().then(category => {
        req.category = category;
        next();
    }).catch(err => {
        res.status(403).json({error: err})
    });
};