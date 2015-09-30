var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    pkg = require('../../../package.json'),
    errors = require('../../components/errors/errors'),
    resemblejs = require('resemble');

exports.view = function(req, res) {
    if (req.query && req.query.imgA && req.query.imgB) {
        res.render('image-compare', {
            path: ['resources', pkg.version].join('/'),
            pkg: pkg,
            config: config,
            img: [req.query.imgA, req.query.imgB]
        });   
    } else {
        // TODO generate error or validation of parameters
    }
};

exports.compare = function(req, res) {
    // TODO Validate parameters buildNumber, box, email
    
    
    /*resemble(oldImg.attr('src')).compareTo(newImg.attr('src')).onComplete(function(data) {
        //enable download button
        downloadBtn.removeAttr('disabled');


        diffImg.data('loaded', true);
        screenshot.set('misMatchPercentage', data.misMatchPercentage);
        screenshot.set('compared', true);

        if (data.misMatchPercentage > 0) {
            diffCaption.html('<i class="fa fa-exclamation-circle"></i> The new image is ' + accounting.formatNumber(data.misMatchPercentage, 2) + '% different compared to the old.').removeClass('hidden').addClass('text-warning').removeClass('text-success');
        }
        else {
            diffCaption.html('<i class="fa fa-check-circle"></i> New image and old image are identical.').removeClass('hidden').addClass('text-success').removeClass('text-warning');
        }
        diffImg.attr('src', data.getImageDataUrl());


        if (that.screenshots.every(function(s) {
                return s.get('compared');
            })) {
            resultToolbar.removeClass('hidden');
        }
    });*/
};