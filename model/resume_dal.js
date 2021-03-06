var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view;';



    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT r.*, s.skill_name, s.description, rc.company_id, c.company_name, sch.school_name FROM resume r ' +
    'LEFT JOIN resume_skill rs on rs.resume_id = r.resume_id ' +
    'LEFT JOIN skill s on s.skill_id = rs.skill_id ' +
    'LEFT JOIN resume_company rc on rc.resume_id = r.resume_id ' +
    'LEFT JOIN company c on c.company_id = rc.company_id ' +
    'LEFT JOIN resume_school rsch on rsch.resume_id = r.resume_id ' +
    'LEFT JOIN school sch on sch.school_id = rsch.school_id ' +
    'WHERE r.resume_id = ? ';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        console.log(result);
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
//NEED TO HAVE NESTED FUNCTION CALLS, 4 NESTED FUNCTIONS: ACCOUNTS, SKILLS, COMPANIES, SCHOOLS
    // FIRST INSERT THE RESUME
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';

    var queryData = [params.resume_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        if(err) {
            console.log(err);
        }

        // THEN USE THE RESUME_ID RETURNED AS insertId AND THE SELECTED SKILL_IDs INTO RESUME_SKILL
        var resume_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeSkillData = [];
        for(var i=0; i < params.skill_id.length; i++) {
            resumeSkillData.push([resume_id, params.skill_id[i]]);
        }

        // NOTE THE EXTRA [] AROUND resumeSkillData
        connection.query(query, [resumeSkillData], function(err, result){
            // insert your resume companies() {function(){
                    //insert your resume schools(){ function(){
                        //callback(err, result)
                    //}
            //

            //RESUME COMPANY INSERT
            var company_id = result.insertId;
            var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
            var resumeCompanyData = [];
            for(var i=0; i < params.company_id.length; i++) {
                resumeCompanyData.push([resume_id, params.company_id[i]]);
            }

            connection.query(query, [resumeCompanyData], function(err, result){
                //RESUME SCHOOLS INSERT
                var school_id = result.insertId;
                var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';
                var resumeSchoolData = [];
                for(var i=0; i < params.school_id.length; i++) {
                    resumeSchoolData.push([resume_id, params.school_id[i]]);
                }

                connection.query(query, [resumeSchoolData], function(err, result){
                    console.log([resumeSchoolData]);

                    callback(err, result);
                });

                //callback(err, result);
            });

            //callback(err, result);
        });
    });
};

/*  OLD INSERT
exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.resume_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};
*/

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
});

};

// INSERTS //
//declare the function so it can be used locally
var resumeSkillInsert = function(resume_id, skillIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    for(var i=0; i < skillIdArray.length; i++) {
        resumeSkillData.push([resume_id, skillIdArray[i]]);
    }
    connection.query(query, [resumeSkillData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillInsert = resumeSkillInsert;

var resumeCompanyInsert = function(resume_id, companyIdArray, callback){
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
    var resumeCompanyData = [];
    for(var i=0; i < companyIdArray.length; i++) {
        resumeCompanyData.push([resume_id, companyIdArray[i]]);
    }
    connection.query(query, [resumeCompanyData], function(err, result){
        callback(err, result);
    });
};
module.exports.resumeCompanyInsert = resumeCompanyInsert;

var resumeSchoolInsert = function(resume_id, schoolIdArray, callback){
    var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';
    var resumeSchoolData = [];
    for(var i=0; i < schoolIdArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIdArray[i]]);
    }
    connection.query(query, [resumeSchoolData], function(err, result){
       callback(err, result);
    });
}
module.exports.resumeSchoolInsert = resumeSchoolInsert;






// DELETES //
//declare the function so it can be used locally
var resumeSkillDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillDeleteAll = resumeSkillDeleteAll;

var resumeCompanyDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resumeCompanyDeleteAll = resumeCompanyDeleteAll;

var resumeSchoolDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result){
        callback(err, result);
    });
};
module.exports.resumeSchoolDeleteAll = resumeSchoolDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_skill = ? WHERE resume_id = ?';

    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete resume_skill, resume_company, and resume_school entries for this resume
        resumeSkillDeleteAll(params.resume_id, function(err, result){
            resumeCompanyDeleteAll(params.resume_id, function(err, result){
                resumeSchoolDeleteAll(params.resume_id, function(err, result){

                    //insert resume_skill, resume_company, and resume_school entries for this resume
                    if(params.resume_id != null) {
                        resumeSkillInsert(params.resume_id, params.skill_id, function(err, result){
                            if(params.company_id != null){
                                resumeCompanyInsert(params.resume_id, params.company_id, function(err, result){
                                    if(params.school_id != null){
                                        resumeSchoolInsert(params.resume_id, params.school_id, function(err, result){
                                            callback(err, result);
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        callback(err, result);
                    }
                });
            });
        });
    });
};


/* OLD UPDATE
exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_skill = ? WHERE resume_id = ?';

    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete resume_skill entries for this resume
        resumeSkillDeleteAll(params.resume_id, function(err, result){

            if(params.resume_id != null) {
                //insert resume_skill ids
                resumeSkillInsert(params.resume_id, params.skill_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};
*/

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS resume_getinfo;

 DELIMITER //
 CREATE PROCEDURE resume_getinfo (_resume_id int)
 BEGIN

 SELECT * FROM resume WHERE resume_id = _resume_id;

 SELECT s.*, r.resume_id FROM skill s
 LEFT JOIN resume_skill r on r.skill_id = s.skill_id AND resume_id = _resume_id
 ORDER BY s.skill_name;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL resume_getinfo (4);

 */

exports.edit = function(resume_id, callback) {
    //var query = 'CALL resume_getinfo(?)';
    var query = 'SELECT r.*, s.skill_name, s.description, rc.company_id, c.company_name, sch.school_name FROM resume r ' +
        'LEFT JOIN resume_skill rs on rs.resume_id = r.resume_id ' +
        'LEFT JOIN skill s on s.skill_id = rs.skill_id ' +
        'LEFT JOIN resume_company rc on rc.resume_id = r.resume_id ' +
        'LEFT JOIN company c on c.company_id = rc.company_id ' +
        'LEFT JOIN resume_school rsch on rsch.resume_id = r.resume_id ' +
        'LEFT JOIN school sch on sch.school_id = rsch.school_id ' +
        'WHERE r.resume_id = ? ';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};