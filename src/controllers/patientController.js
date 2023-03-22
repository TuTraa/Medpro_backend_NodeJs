
import patientService from "../services/patientService"

let postBookingApointment = async (req, res) => {
    try {
        console.log('patient', req.body)
        let data = await patientService.postBookingApointment(req.body);
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
let postVerifyBooking = async (req, res) => {
    try {
        let data = await patientService.postVerifyBooking(req.body);
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
let getMyEmination = async (req, res) => {
    try {
        let data = await patientService.getMyEminationService(req.query);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the server'
        })
    }
}

let postImagePaied = async (req, res) => {
    try {
        let data = await patientService.postImagePaied(req.body);
        return res.status(200).json({
            data
        })
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the server'
        })
    }
}


let handleStatusId = async (req, res) => {
    try {
        let data = await patientService.postStatusId(req.body);
        return res.status(200).json({
            data
        })
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from server',
        })
    }
}

module.exports = {
    postBookingApointment: postBookingApointment,
    postVerifyBooking: postVerifyBooking, getMyEmination,
    postImagePaied, handleStatusId

}