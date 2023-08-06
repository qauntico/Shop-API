const Category = require('../models/category');
//create a category
exports.create = async (req,res) => {
    const category = new Category(req.body);
    await category.save().then(result => {
        res.json({success: "That Category has been Created"});
    }).catch(err => {
        res.status(403).json({error: "An Error Occured or Either That Category Already Exist"});
    });
};
//list out categories 
exports.list = async (req,res) => {
    await Category.find({}).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(403).json({error: "Could not get category"})
    })
};
//send out a single category
exports.category = async (req,res) => {
    res.send(req.category);
};
//update a single category
exports.update = async (req, res) => {
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
        .then(res.json({success: 'Category Was Successfully Deleted'}))
        .catch(err => {
            res.status(403).json({error: 'Could Not Delete Category And Error Occured'})
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