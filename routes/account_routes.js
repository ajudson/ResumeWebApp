var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal');


// View All accounts
router.get('/all', function(req, res) {
    account_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('account/accountViewAll', { 'result':result });
        }
    });

});

// View the school for the given id
router.get('/', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        account_dal.getById(req.query.account_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('account/accountViewById', {'result': result});
            }
        });
    }
});

// Return the add a new account form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
account_dal.getAll(function(err,result) {
    if (err) {
        res.send(err);
    }
    else {
        res.render('account/accountAdd', {'account': result});
    }
});
});

// insert a account record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.first_name == null) {
        res.send('First Name must be provided.');
    }
    else if(req.query.last_name == null) {
        res.send('Last Name must be provided.');
    }
    else if(req.query.email == null) {
        res.send('An email must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        account_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/account/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.company_id == null) {
        res.send('A company id is required');
    }
    else {
        company_dal.edit(req.query.company_id, function(err, result){
            console.log(result);
            res.render('company/companyUpdate', {company: result[0][0], address: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.company_id == null) {
        res.send('A company id is required');
    }
    else {
        company_dal.getById(req.query.company_id, function(err, company){
            address_dal.getAll(function(err, address) {
                res.render('company/companyUpdate', {company: company[0], address: address});
            });
        });
    }

});

// Delete an account for the given account_id
router.get('/delete', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        account_dal.delete(req.query.account_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/account/all');
            }
        });
    }
});

module.exports = router;