var express = require('express');
var router = express.Router(); 
const { check, validationResult } = require('express-validator/check');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');

var foundItems = require('../models/foundItems.js')

var Category = require('../models/category.js')

/*Get foundItems index*/
router.get('/', function (req, res){
    var count;

    foundItems.count(function (err, c) {
       count = c; 
    });

    foundItems.find(function(err, foundItems){
        res.render('admin/foundItems', {
            foundItems: foundItems,
            count: count
        });
    });
});

/*GET add_foundItem*/
router.get('/add_foundItem', function(req, res) {
    
    var title = "";
    var description = "";
    var color = "";
    var place = "";
    var date = "";

    Category.find(function(err, categories){
        res.render('admin/add_foundItem',    {
            title: title,
            description: description,
            categories: categories,
            color: color,
            place: place,
            date: date
        });
    });

});

/*POST add_foundItem*/
router.post('/add_foundItem', function(req, res) {
    
    if(!req.files){
        imageFile ="";
    }

    if(req.files) {
        var imageFile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";
    }

    //VALIDATE THE VARIABLES
    req.checkBody('title', 'Item name should not be empty.').notEmpty();
    req.checkBody('description', 'Please enter a brief description.').notEmpty();
    req.checkBody('color', 'Please enter color of item.').notEmpty();
    req.checkBody('date', 'Please enter the estimated date that you found the item.').notEmpty();
    req.checkBody('place', 'Please enter the location that you found the item.').notEmpty();
    req.checkBody('image', 'Please Upload an Image.').isImage(imageFile);

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var color = req.body.color;
    var date = req.body.date;
    var place = req.body.place;
    var category = req.body.category;

    var errors = req.validationErrors();

    if(errors){ 
        Category.find(function (err, categories){
            res.render('admin/add_foundItem',    {
                errors: errors,
                title: title,
                description: description,
                categories: categories,
                color: color,
                place: place,
                date: date
            });
        });
    }   else{
            foundItems.findOne({slug: slug}, function(err, foundItem){
                if(foundItem){
                    // req.flash('danger', 'Found Item name exists');
                    Category.find(function (err, categories){
                        res.render('admin/add_foundItem',    {
                            title: title,
                            description: description,
                            categories: categories,
                            color: color,
                            date: date,
                            place: place
                        });
                    });   
            }   else {
                    var foundItem = new foundItems({
                        title: title,
                        slug: slug,
                        description: description,
                        category: category,
                        color: color,
                        date: date,
                        place: place,
                        image: imageFile
                    
                    });

                    foundItem.save(function(err) {
                        if(err) 
                            return console.log(err);

                        mkdirp('public/foundItems_images/'+ foundItem._id + "/", function(err){
                            return console.log(err);

                        });

                        if (imageFile != ""){
                            var foundItemImage = req.files.image;
                            var path = './public/foundItems_images/' + foundItem._id + '/' + imageFile;
    
                            foundItemImage.mv(path, function(err){
                                return console.log(err);
                            });

                        }

                        req.flash('success', 'Found Items added!');
                        res.redirect('/admin/foundItems');
                    });
                }
        });
        
    }
    
});

/*GET edit_foundItem*/
router.get('/edit_foundItem/:id', function(req, res) {
    var errors;

    if(req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;

    Category.find(function (err, categories)  {

        foundItems.findById(req.params.id, function(err, a){
            if (err){
                console.log(err);
                res.redirect('admin/foundItems');
            } else {
                var imagesDir = 'public/foundItems_images'
                var images = null;

                fs.readdir(imagesDir, function(err, files) {
                    if(err){
                        console.log(err);
                    } else{
                        images = files;

                        res.render('admin/edit_foundItem',    {
                            title: a.title,
                            errors: errors,
                            description: a.description,
                            categories: categories,
                            category: a.category.replace(/\s+/g, '-').toLowerCase(),
                            color: a.color,
                            date: a.date,
                            images: images,
                            place: a.place,
                            id: a._id
                        });
                    }   
                });

            }
        });
    });
});

/*POST edit_foundItem*/
router.post('/edit_foundItem/:id', function(req, res) {

    if(!req.files){
        imageFile ="";
    }

    if(req.files) {
        var imageFile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";
    }

    //VALIDATE THE VARIABLES
    req.checkBody('title', 'Item name should not be empty.').notEmpty();
    req.checkBody('description', 'Please enter a brief description.').notEmpty();
    req.checkBody('color', 'Please enter color of item.').notEmpty();
    req.checkBody('date', 'Please enter the estimated date that you found the item.').notEmpty();
    req.checkBody('place', 'Please enter the locationthat you found the item.').notEmpty();
    req.checkBody('image', 'Please Upload an Image.').isImage(imageFile);

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var color = req.body.color;
    var date = req.body.date;
    var category = req.body.category;
    var place = req.body.place;
    var aimage = req.body.aimage;
    var id = req.params.id;

    var errors = req.validationErrors();

    if(errors) {
        req.session.errors = errors;
        res.redirect('/admin/foundItems/edit_foundItem' +id )
    } else{
        foundItems.findOne({slug: slug, _id:{'$ne':id}}, function(err, a){
            if(err)
                console.log(err);
            if(a) {
                // req.flash('danger', 'Found Item already exists');
                res.redirect('/admin/foundItems/edit_foundItem/' + id);
            } else{
                foundItems.findById(id, function(err, a) {
                    if(err)
                        console.log(err);

                    a.title = title;
                    a.slug = slug;
                    a.description = description;
                    a.category = category;
                    a.color = color;
                    a.date = date;
                    a.place = place;
                    
                    if(imageFile !==""){
                        a.image = imageFile;
                    }

                    a.save(function (err) {
                        if(err)
                            console.log(err);

                        if(imageFile !=""){
                            if(aimage !==""){
                                fs.remove('./public/foundItems_images/' + id + "/" + imageFile, function (err) {
                                    if (err)
                                        console.log(err);
                                });
                            }
                            
                            var foundItemImage = req.files.image;
                            var path = './public/foundItems_images/' + id + "/" + imageFile;
    
                            foundItemImage.mv(path, function(err){
                                return console.log(err);
                            });
                            
                        }

                        req.flash('success', 'Found Items edited!');
                        res.redirect('/admin/foundItems/');

                    });
                });
            }
        });
    }
});

/*GET delete_foundItem*/
router.get('/delete_foundItem/:id', function(req, res) {
    var id = req.params.id;
    var destination = './public/foundItems_images/' + id;
    fs.remove(destination, function (err){
        if(err){
            console.log(err);
        } else {
            foundItems.findByIdAndRemove(id, function (err) {
                console.log(err);
            });

            req.flash('success', 'Item was removed!');
            res.redirect('/admin/foundItems');
        }
    });
});

router.get('/request_foundItem/:id', function(req, res) {
    var errors;

    if(req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;

    Category.find(function (err, categories)  {

        foundItems.findById(req.params.id, function(err, a){
            if (err){
                console.log(err);
                res.redirect('admin/foundItems');
            } else {
                var imagesDir = 'public/foundItems_images'
                var images = null;

                fs.readdir(imagesDir, function(err, files) {
                    if(err){
                        console.log(err);
                    } else{
                        images = files;

                        res.render('admin/request_foundItem',    {
                            title: a.title,
                            errors: errors,
                            description: a.description,
                            categories: categories,
                            category: a.category.replace(/\s+/g, '-').toLowerCase(),
                            color: a.color,
                            date: a.date,
                            images: images,
                            place: a.place,
                            id: a._id
                        });
                    }   
                });

            }
        });
    });
});

module.exports = router;
