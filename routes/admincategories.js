var express = require('express');
var router = express.Router(); 
const { check, validationResult } = require('express-validator/check');

// Get CategorySchema
var Category = require('../models/category')

/*Category index*/
router.get('/', function(req, res){
    Category.find(function (err, categories) {
        if(err)
        return console.log(err);

        res.render('admin/categories', {
            categories: categories
        });
    });
});

/*GET add_category*/    
router.get('/add_category', function(req, res) {
    
    var title = "";

    res.render('admin/add_category',    {
        title: title,
    });
});

/*POST add_category*/
router.post('/add_category', function(req, res) {
    
    //VALIDATE THE VARIABLES
    req.checkBody('title', 'Title must have a value.').notEmpty()

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if(errors){ 
        res.render('admin/add_category',    {
            errors: errors,
            title: title
        });

    }   else{
            Category.findOne({slug: slug}, function(err, category){
                if(category){
                    req.flash('danger', 'Category already exists');
                    res.render('admin/add_category',    {
                        title: title
                });
            }   else {
                    var category = new Category({
                        title: title,
                        slug: slug
                    });

                    category.save(function(err) {
                        if(err) 
                            return console.log(err);

                        req.flash('success', 'Category added!');
                        res.redirect('/admin/categories');

                        Category.find(function (err, categories) {
                            if (err){
                              console.log(err);
                            } else {
                              req.app.locals.categories = categories;
                            }
                          });
                    });

                }
        });
        
    }
    
});

/*GET edit_category*/
router.get('/edit_category/:id', function(req, res) {
    Category.findById(req.params.id, function (err, category)  {
        if (err)
            return console.log(err);
    
        res.render('admin/edit_category',    {
            title: category.title,
            id: category._id

        });
    });
});

/*POST edit_category*/
router.post('/edit_category/:id', function(req, res) {
    
    //VALIDATE THE VARIABLES
    req.checkBody('title', 'Title must have a value.').notEmpty()

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var id = req.params.id;

    var errors = req.validationErrors();

    if(errors){ 
        res.render('admin/edit_category',    {
            errors: errors,
            title: title,
            id: id
        });

    }   else{
            Category.findOne({slug: slug, _id:{'$ne':id}}, function(err, category){
                if(category){
                    req.flash('danger', 'Category already exists');
                    res.render('admin/edit_category',    {

                        title: title,
                        id: id
                });
            }   else {
                    Category.findById(id, function(err, category){
                        if(err)
                            return console.log(err);

                        category.title = title;
                        category.slug = slug;

                        category.save(function(err) {
                            if(err) 
                                return console.log(err);
    
                            req.flash('success', 'Category added!');
                            res.redirect('/admin/categories/edit_category/'+ id);

                            Category.find(function (err, categories) {
                                if (err){
                                  console.log(err);
                                } else {
                                  req.app.locals.categories = categories;
                                }
                              });
                        });

                    });


                }
        });
        
    }
    
});

/*GET delete_category*/
router.get('/delete_category/:id', function(req, res) {
    Category.findByIdAndRemove(req.params.id, function(err){
        if (err) 
            return console.log(err);
        req.flash('success', 'Page deleted!');
        res.redirect('/admin/categories/');
    });
});

module.exports = router;
