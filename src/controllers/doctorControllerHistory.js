import doctorService from "../services/doctorService";


let getListPatientForDoctorS0History = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S0", req.query.phone, 1);
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
let getListPatientForDoctorCancelHistory = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S4", req.query.phone, 1);
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
let getListPatientForDoctorDoneHistory = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S3", req.query.phone, 1);
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
let getListPatientForDoctorNotComeHistory = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S1", req.query.phone, 1);
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
let getListPatientForDoctorIsActiveHistory = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctorServiceS0(req.query.doctorId, req.query.dataTime, "S2", req.query.phone, 1);
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




module.exports = {
    getListPatientForDoctorS0History, getListPatientForDoctorCancelHistory,
    getListPatientForDoctorDoneHistory, getListPatientForDoctorNotComeHistory,
    getListPatientForDoctorIsActiveHistory,
}