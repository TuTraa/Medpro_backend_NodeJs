import { reject } from "lodash";
import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctorSevice();
        return res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from sever',
        })
    }
}

let saveInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInforDoctor(req.body);
        return res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from sever',
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(
            infor
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the sever',
        })
    }

}
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(
            infor
        )

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the sever'
        })
    }
}
let bulkDeleteSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkDeleteSchedule(req.body);
        return res.status(200).json(
            infor
        )

    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the sever'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(
            infor
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the sever'
        })
    }
}
let getExtraInforDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the sever'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {

        let data = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the sever'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorService(req.query.doctorId, req.query.dataTime);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server'
        })
    }
}
let getListPatientForDoctorS0 = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S0", req.query.phone);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server'
        })
    }
}
let getListPatientForDoctorCancel = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S4", req.query.phone);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server'
        })
    }
}
let getListPatientForDoctorDone = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S3", req.query.phone);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server'
        })
    }
}
let getListPatientForDoctorNotCome = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S1", req.query.phone);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server'
        })
    }
}
let getListPatientForDoctorIsActive = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S2", req.query.phone);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server'
        })
    }
}
let getListPatientForDoctorChange = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S5", req.query.phone);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server'
        })
    }
}


//send email then finish 
let sendRemedy = async (req, res) => {
    try {
        let data = await doctorService.sendRemedy(req.body);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }

}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor, sendRemedy,
    getListPatientForDoctorS0, getListPatientForDoctorCancel,
    getListPatientForDoctorDone, getListPatientForDoctorNotCome,
    getListPatientForDoctorIsActive, getListPatientForDoctorChange,
    bulkDeleteSchedule
}