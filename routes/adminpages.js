var express = require('express');
var router = express.Router(); 
const { check, validationResult } = require('express-validator/check');

var Page = require('../models/page.js')

/*Pages index*/
router.get('/', function(req, res){
    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
        res.render('admin/pages', {
            pages: pages    
        });
    });
});

/*GET add_page*/
router.get('/add_page', function(req, res) {
    
    var title = "";
    var slug = "";
    var sorting ="";
    var content ="";

    res.render('admin/add_page',    {
        title: title,
        slug: slug,
        sorting: sorting,
        content: content

    });
});

/*POST add_page*/
router.post('/add_page', function(req, res) {
    
    //VALIDATE THE VARIABLES
    req.checkBody('title', 'Title must have a value.').notEmpty()
    req.checkBody('sorting', 'Page Order must have a value.').notEmpty()
    req.checkBody('content', 'Content must have a value.').notEmpty()


    var title = req.body.title;
    var sorting = req.body.sorting;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();

    if(errors){ 
        res.render('admin/add_page',    {
            errors: errors,
            title: title,
            slug: slug,
            sorting: sorting,
            content: content
        });

    }   else{
            Page.findOne({slug: slug, sorting:sorting}, function(err, page){
                if(page){
                    req.flash('danger', 'Page slug exists or Page Number exists');
                    res.render('admin/add_page',    {
                        errors: errors,
                        title: title,
                        slug: slug,
                        sorting: sorting,
                        content: content
                });
            }   else {
                    var page = new Page({
                        title: title,
                        slug: slug,
                        content: content,
                        sorting: sorting,
                    });

                    page.save(function(err) {
                        if(err) 
                            return console.log(err);

                        req.flash('success', 'Page added!');
                        res.redirect('/admin/pages');
                    });
                }
        });
        
    }
    
});

/*GET edit_page*/
router.get('/edit_page/:id', function(req, res) {
    Page.findById( req.params.id, function (err, page)  {
        if (err)
            return console.log(err);
    
        res.render('admin/edit_page',    {
            title: page.title,
            slug: page.slug,
            sorting: page.sorting,
            content: page.content,
            id: page._id

        });
    });
});

/*POST edit_page*/
router.post('/edit_page/:id', function(req, res) {
    
    //VALIDATE THE VARIABLES
    req.checkBody('title', 'Title must have a value.').notEmpty()
    req.checkBody('sorting', 'Page Order must have a value.').notEmpty()
    req.checkBody('content', 'Content must have a value.').notEmpty()


    var title = req.body.title;
    var sorting = req.body.sorting;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.params.id;

    var errors = req.validationErrors();

    if(errors){ 
        res.render('admin/edit_page',    {
            errors: errors,
            title: title,
            slug: slug,
            sorting: sorting,
            content: content,
            id: id
        });

    }   else{
            Page.findOne({slug: slug, _id:{'$ne':id}, sorting:sorting}, function(err, page){
                if(page){
                    req.flash('danger', 'Page slug exists or Page Number exists');
                    res.render('admin/edit_page',    {
                        errors: errors,
                        title: title,
                        slug: slug,
                        sorting: sorting,
                        content: content,
                        id: id
                });
            }   else {
                    Page.findById(id, function(err, page){
                        if(err)
                        return console.log("error");
                        page.title = title;
                        page.slug = slug;
                        page.sorting = sorting;
                        page.content = content;

                        page.save(function(err) {
                            if(err) 
                                return console.log(err);
    
                            req.flash('success', 'Page added!');
                            res.redirect('/admin/pages/edit_page/'+ id);
                        });

                    });


                }
        });
        
    }
    
});

/*GET delete page*/
router.get('/delete_page/:id', function(req, res) {
    Page.findByIdAndRemove(req.params.id, function(err){
        if (err) 
            return console.log(err);
        req.flash('success', 'Page deleted!');
        res.redirect('/admin/pages/');
    });
});

module.exports = router;
