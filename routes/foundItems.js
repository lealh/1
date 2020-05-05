
var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var foundItems = require('../models/foundItems');
var Category = require('../models/category');
var Color = require('../models/color'); 

router.get('/', function (req, res){

    foundItems.find(function(err, foundItems){
        res.render('main/all_foundItems', {
            title: 'All Found Items',
            foundItems: foundItems,
        });
    });
});

router.get('/:category', function (req, res){

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function(err, d) {
        foundItems.find({category: categorySlug}, function(err, foundItems){
            if(err)
                console.log(err);

            res.render('main/category_foundItems', {
                title: d.title,
                foundItems: foundItems
            });
        });
    });
});


/*GET DETAILS*/

// router.get('/:category/:foundItem', function (req, res){

//     var images = null;

//     foundItems.findById(req.params.id, function(err, foundItem){
//         if(err){
//             console.log(err);
//         } else{
//             // var imagesDir = 'public/foundItems_images/:_id';

//             // fs.readdir(imagesDir, function(err, files){
//             //     if(err){
//             //         console.log(err);
//             //      } else{
//             //          images = files;

//                     res.render('main/foundItem', {
//                         f: foundItem,
//                         images: images
//                     });
//             //     }
//             // });
//         }
//     });
// });

// router.get('/:category/:foundItems', (req, res) => {

//     var images = null;

//     foundItems.findOne({slug : req.params.slug}).then((foundItems) => {
//       if(!foundItems) { //if page not exist in db
//         return res.status(404).send('Page not found');
//       }
//       else{
//         var imagesDir = 'public/foundItems_images/' + foundItems._id;

//         fs.readdir(imagesDir, function(err, files){
//             if(err){
//                 console.log(err);
//              } else{
//                  images = files;

//                  res.render('main/foundItem', { //page  exist
//                         title: foundItems.title,
//                         f: foundItems,
//                         images: images
//                 });
//              }
//                 }).catch((e) => {//bad request 
//                   res.status(400).send(e);
//                 });
//         }
            
//     });

// });



module.exports = router;
