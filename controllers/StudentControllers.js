
// IMPORTING ALL THE DATABASE COLLECTIONS
const User = require("../models/user");
const Student = require("../models/student");
const Company = require("../models/company");

// CREATE STUDENT FORM 
module.exports.createreq = async function(req,resp){

    try{

        if (!req.isAuthenticated()) {

           return resp.redirect("/users/login");
        }
        let studnt=[{}];
        
        console.log('Adding a new Student ');

        return resp.render('createStudent',{studnt});


    }catch(error){
        console.log(`Error during submit the create student form:  ${error}`);
        resp.redirect("back");
    }
}
// CREATE STUDENT FROM FORM DATA WITH ALL CHECKS AND SAVE IT TO DATABASE
module.exports.createStudent = async function(req,resp){

    try {

      if (!req.isAuthenticated()) {
        return resp.redirect("/users/login");
      }

      let IsStudent = await Student.findOne({email:req.body.studentemail});

      if(!IsStudent){

        const newStudent = await Student.create({
          name: req.body.studentname,
          collegename: req.body.studentclgname,
          clgplacemnt:req.body.plcemntstatus,
          mobilenumber: req.body.studentmobileno,
          email: req.body.studentemail,
          batch: req.body.studentbatch,
          dsascore: req.body.studentdsascore,
          webdevscore: req.body.studentwebscore,
          reactscore: req.body.studentreactscore,
        });

        await newStudent.save();

        if (!newStudent) {
          console.log("error in creating new student");
          return resp.redirect("back");
        }
        req.flash("success", "Create Successfully");
        console.log('Student is added successfully');

        return resp.redirect("/");

      }else{
        req.flash("error", "E-Mail ID Already present");
        console.log('E-mail id is already in database(student)')
        return resp.redirect("back");
      }
    } catch (error) {
      console.log(`Error during submit the createstudent form:  ${error}`);
      resp.redirect("back");
    }

}

// VIEW STUDENT DETAILS 
module.exports.viewdata = async function(req,resp){

     try {
       if (!req.isAuthenticated()) {
         return resp.redirect("/users/login");
       }

       let studnt = await Student.findById(req.params.id);

       console.log('view a details of students');

       return resp.render("viewstudent",{studnt});
       
     } catch (error) {
       console.log(`Error during view the student:  ${error}`);
       resp.redirect("back");
     }

}

// UPDATE FORM OPEN FOR THE RECORDS FOR STUDENT TO BE UPDATED NOT EMAIL
module.exports.updatereq = async function(req,resp){

    try {

      if (!req.isAuthenticated()) {
        return resp.redirect("/users/login");
      }

      let studnt = await Student.findById(req.params.id);
      
      console.log('Going for some modification in students details');

      return resp.render("editStudent", { studnt });
    } catch (error) {
      console.log(`Error during updating the student form:  ${error}`);
      resp.redirect("back");
    }
}

// UPDATE FORM DATA GET PASSING THROUGH ALL CHECK THEN SAVE IT.
module.exports.updtedone = async function(req,resp){

    try {
      if (!req.isAuthenticated()) {
        return resp.redirect("/users/login");
      }

      let IsStudent = await Student.findOne({ email: req.body.studentemail });

      if (IsStudent) {
        await IsStudent.updateOne({
          name: req.body.studentname,
          collegename: req.body.studentclgname,
          clgplacemnt: req.body.plcemntstatus,
          mobilenumber: req.body.studentmobileno,
          batch: req.body.studentbatch,
          dsascore: req.body.studentdsascore,
          webdevscore: req.body.studentwebscore,
          reactscore: req.body.studentreactscore,
        });

        await IsStudent.save();
        req.flash("success", "Successfully Updated");
        console.log('Students details are update successfully');

        return resp.redirect("/");

      } else {
        return resp.redirect("back");
      }
    } catch (error) {
      console.log(`Error during updating the student records:  ${error}`);
      resp.redirect("back");
    }
}

// DELETE THE STUDENT
module.exports.deletedata = async function(req,resp){

  try {
    if (!req.isAuthenticated()) {
      return resp.redirect("/users/login");
    }

    let studnt = await Student.findById(req.params.id);
    
    if(studnt){

        if (studnt) {
          if (studnt.interviews.length > 0) {
            for (let studentcompany of studnt.interviews) {
              let deletestdfrmcompny = await Company.findOne({
                name: studentcompany.companyname,
              });

              if (deletestdfrmcompny) {
                for (let i=0;i<deletestdfrmcompny.students.length;i++) {
                  if (deletestdfrmcompny.students[i].student._id == req.params.id) {
                      deletestdfrmcompny.students.splice(i, 1);
                      deletestdfrmcompny.save();
                      break;
                  }
                }
              }
            }
          }

          await Student.findByIdAndDelete(req.params.id);
        }
    }
    req.flash("success", "Deleted Successfully");
    console.log('Student is deleted successfully');
    
    return resp.redirect('/');

  } catch (error) {
    
    console.log(`Error during deleting the student:  ${error}`);
    resp.redirect("back");
  }


}