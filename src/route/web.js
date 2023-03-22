import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController"

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCrud);
  router.get("/get-crud", homeController.displayGetCrud);
  router.get("/edit-crud", homeController.getEditCrud);
  router.post("/put-crud", homeController.putCrud);
  router.get("/delete-crud", homeController.deleteCrud);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-users", userController.handleCreateUser);
  router.delete("/api/delete-new-users", userController.handleDeleteUser);
  router.put("/api/update-new-users", userController.handleEditUser);

  router.get("/api/allcode", userController.getAllCode);
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);


  router.get("/api/get-all-doctor", doctorController.getAllDoctor);

  router.post("/api/save-infor-doctor", doctorController.saveInforDoctor);
  router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);
  router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
  router.get("/api/get-Schedule-byDate", doctorController.getScheduleByDate);
  //get data detail doctor infor
  router.get("/api/get-extra-inforDoctor-byId", doctorController.getExtraInforDoctorById);
  //profile modal
  router.get("/api/get-profile-doctor-byId", doctorController.getProfileDoctorById);

  //infor schedule 
  router.get("/api/get-list-patient-for-doctor", doctorController.getListPatientForDoctor)
  // infor data xamtruction waiting S0
  router.get("/api/get-list-patient-for-doctor-S0", doctorController.getListPatientForDoctorS0)
  router.post("/api/send-remedy", doctorController.sendRemedy)

  //apopointment

  router.post("/api/patient-book-appointment", patientController.postBookingApointment);
  router.post("/api/verify-book-appointment", patientController.postVerifyBooking);

  router.post("/api/create-new-specialty", specialtyController.createSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get("/api/get-detail-specialty", specialtyController.getDetailSpecialtyById);

  router.post("/api/create-new-clinic", clinicController.createClinic);
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get("/api/get-detail-clinic", clinicController.getDetailClinicById);

  //paient get my emination
  router.get("/api/get-my-emination", patientController.getMyEmination);

  router.post("/api/post-image-paied", patientController.postImagePaied);

  router.post("/api/post-statusId", patientController.handleStatusId);

  return app.use("/", router);
};
module.exports = initWebRoutes;
