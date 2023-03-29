import clinicService from '../services/clinicService'
let createClinic = async (req, res) => {
    try {

        let data = await clinicService.createClinicService(req.body);
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


let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinicService();
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
let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicById(req.query.id);
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

let deleteClinic = async (req, res) => {
    try {
        let data = await clinicService.deleteClinicService(req.body.id);
        return res.status(200).json({
            data
        })
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from server !',
        })
    }
}
let editClinic = async (req, res) => {
    try {
        let data = await clinicService.editClinicService(req.body);
        return res.status(200).json({
            data
        })
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from server!',
        })
    }
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    deleteClinic, editClinic
}