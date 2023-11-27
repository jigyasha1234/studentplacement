// IMPORTING THE ALL THE DATABASES COLLECTIONS
const User = require("../models/user");
const Student = require("../models/student");
const Company = require("../models/company");

// HOMEPAGE FOR COMPANY PORTAL
module.exports.companyhome =async function(req,resp){

     try {

      if (!req.isAuthenticated()) {

        return resp.redirect("/users/login");

      }

      let studentlist = await Student.find({});
      
      req.flash("success", "COMPANY PORTAL");
      
      return resp.render("company",{studentlist});

     }catch (error) {

      console.log(`Error on company homepage:  ${error}`);
      resp.redirect("back");

     }
}

// ALLOCATE THE INTERVIEW TO STUDENTS I.E FORM IS OPEN
module.exports.allocateInterview = async function(req,resp){

    try {

      if (!req.isAuthenticated()) {
        return resp.redirect("/users/login");
      }

      let students = await Student.find({});
     

      let batch = await Student.find({});
      batch_array=[];
      for(let st of batch){
        batch_array.push(st.batch);
      }
      batch_array = [...new Set(batch_array)];

      return resp.render("allocateInterview",{students,batch_array});

    } catch (error) {
      console.log(`Error during allocating the interview form:  ${error}`);
      resp.redirect("back");
    }
}

// INTERVIEW SCHEDULE TO STUDENT AND SUBMIT WITH DATABSE ADDED
module.exports.scheduleInterview = async function(req,resp){

    try {
      if (!req.isAuthenticated()) {
        return resp.redirect("/users/login");
      }

      let compny = await Company.findOne({name:req.body.companyname});
      let studentid = req.body.studentname;

      if(!compny){

           let data = {
             student: req.body.studentname,
             date: req.body.companydate,
             result: "Pending",
           };

          let newlyaddedd=await Company.create({
            name: req.body.companyname,
          });
          newlyaddedd.students.push(data);
          newlyaddedd.save();
      }
      else
      {
          for(let std of compny.students)
          {
            if(std.student._id == studentid){

              req.flash("error", "STUDENT ALREADY INTERVIEW SCHEDULED");
              console.log("Student interview already added");

              return resp.redirect("back");
            }
          }
           let data = {
             student: req.body.studentname,
             date: req.body.companydate,
             result: "Pending",
           };
           compny.students.push(data);
           compny.save();
      }

      let studnt = await Student.findById(studentid);

      if(studnt){
        let studentinterview = {
          companyname: req.body.companyname,
          scheduledate: req.body.companydate,
          result: "Pending",
        };
        studnt.interviews.push(studentinterview);
        studnt.save();
    }

    req.flash("success", "HURRAY INTERVIEW SCHEDULE");
    console.log('Interview schedule for this student');

    return resp.redirect('/')

    } catch (error) {
      console.log(`Error during scdeuling the interview:  ${error}`);
      resp.redirect("back");
    }
}

// STATUS CHANGES WHICH IS INTERVIEW RESULT
module.exports.updateRecords = async function(req,resp){

  try {

    if (!req.isAuthenticated()) {
      return resp.redirect("/users/login");
    }
    let present=false;

    let studnt = await Student.findById(req.params.id);
    if(studnt){

      if(studnt.interviews.length > 0){

        for(let cmpy of studnt.interviews){
          if(cmpy.companyname == req.body.cname){
            cmpy.result = req.body.companyresult;
            studnt.save();
            present=true;
            break;
          }
        }

      }

      if(present){

        let compname = await Company.findOne({name:req.body.cname});

        if(compname){

          for (let stdid of compname.students) {
            if (stdid.student._id == req.params.id) {
              stdid.result = req.body.companyresult;
              compname.save();
            }
          }
        }
      }
    }
    req.flash("success", "STAUS CHANGES");
    console.log('Interview status get changed');

    return resp.redirect('back');

  } catch (error) {
    console.log(`Error during changing the interview status:  ${error}`);
    resp.redirect("back");
  }

}

