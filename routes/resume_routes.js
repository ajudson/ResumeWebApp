var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var skill_dal = require('../model/skill_dal');
var company_dal = require('../model/company_dal');
var school_dal = require('../model/school_dal');

// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });
});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                school = [result.length];
                skill = [result.length];
                company = [result.length];

                for(var i=0; i < result.length; i++){
                    skill[i] = result[i].skill_name, result[i].description;
                }

                for(var i=0; i < result.length; i++){
                    company[i] = result[i].company_name;
                }

                for(var i=0; i < result.length; i++){
                    school[i] = result[i].school_name;
                }


                var uniq_skill = skill.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });

                var uniq_company = company.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });

                var uniq_school = school.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });


                res.render('resume/resumeViewById', {'result': result, 'skill': uniq_skill, 'company': uniq_company, 'school': uniq_school});
            }
        });
    }
});

// Return the add a new resume form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually

    account_dal.getAll(function(err,account) {
        company_dal.getAll(function(err,company) {
            skill_dal.getAll(function(err,skill) {
                school_dal.getAll(function(err,school) {

        if (err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeAdd', {'account': account, 'company': company, 'skill': skill, 'school': school});
        }

                });
            });
        });
    });
});

// insert a resume record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('Resume Name must be provided.');
    }
    else if(req.query.account_id == null) {
        res.send('An Account must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        account_dal.getAll(function (err, accountres) {
            if (err) {
                res.send(err)
            }
            else {
                skill_dal.getAll(function (err, skillres) {

                    if (err) {
                        res.send(err)
                    }
                    else {
                        company_dal.getAll(function (err, companyres) {
                            if (err) {
                                res.send(err)
                            }
                            else {
                                school_dal.getAll(function (err, schoolres) {
                                    if (err) {
                                        res.send(err)
                                    }
                                    else {
                                        resume_dal.edit(req.query.resume_id, function (err, resumeres) {
                                            if (err) {
                                                res.send(err)
                                            }
                                            else {
                                                var skill = [skillres.length];
                                                var company = [companyres.length];
                                                var school = [schoolres.length];

                                                for (var i = 0; i < resumeres.length; i++) {
                                                    skill[i] = resumeres[i].skill_name;
                                                }
                                                var uniqskill = skill.filter(function (elem, index, self){
                                                   return index == self.indexOf(elem);
                                                });


                                                for (var i = 0; i < resumeres.length; i++) {
                                                    console.log(i);
                                                    company[i] = resumeres[i].company_name;
                                                    console.log(company[i]);
                                                }
                                                var uniqcompany = company.filter(function (elem, index, self){
                                                    return index == self.indexOf(elem);
                                                });


                                                for (var i = 0; i < resumeres.length; i++) {
                                                    school[i] = resumeres[i].school_name;
                                                }
                                                var uniqschool = school.filter(function (elem, index, self){
                                                    return index == self.indexOf(elem);
                                                });

                                                uniqvalues = {'skill': uniqskill, 'company': uniqcompany, 'school': uniqschool};

                                                console.log(uniqcompany);
                                                console.log(company);

                                                res.render('resume/resumeUpdate', {
                                                   'uniqvalues': uniqvalues, 'account': accountres, 'resume': resumeres[0], 'skill': skillres, 'company': companyres, 'school': schoolres
                                                });

                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }


















});

/* OLD EDIT
router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.edit(req.query.resume_id, function(err, result){
            console.log(result);
            res.render('resume/resumeUpdate', {resume: result[0][0], skill: result[1]});
        });
    }

});
*/

router.get('/edit2', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err, skill){
            resume_dal.getAll(function(err, skill) {
                res.render('resume/resumeUpdate', {resume: resume[0], skill: skill});
            });
        });
    }

});

router.get('/update', function(req, res) {
    resume_dal.update(req.query, function(err, result){
        res.redirect(302, '/resume/all');
    });
});


// Delete a resume for the given resume_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

module.exports = router;