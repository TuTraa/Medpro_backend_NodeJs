
import db from "../models/index";
import _, { reject } from "lodash"
require('dotenv').config();
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';



let butldUrlEmail = (doctorId, token) => {
    // let result = uuidv4(); 
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookingApointment = (data) => {
    // console.log('data controller==', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName || !data.adress || !data.SelectedGender || !data.dayTime) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter save booking"
                })
            }
            else {
                let token = uuidv4();
                await emailService.sendsimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.examinationtime,
                    doctorName: data.doctorName,
                    redirectLink: butldUrlEmail(data.doctorId, token),
                    language: data.language,
                });
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        address: data.adress,
                        phoneNumber: data.phoneNumber,
                        roleId: "R3",
                        gender: data.SelectedGender,
                        firstName: data.fullName,
                    }
                });

                if (user && user[0]) {
                    console.log(1);
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            statusId: 'S2',
                            doctorId: data.doctorId,
                        },
                        defaults: {
                            statusId: 'S00',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.dayTime,
                            timeType: data.timeType,
                            reason: data.reason,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "save infor patient success!"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let postVerifyBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {
                let apopointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S00',
                    },
                    raw: false,
                })
                if (apopointment) {
                    apopointment.statusId = 'S0';
                    await apopointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "update apopointment success!"
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: "Apopointment has been activated or does not exist",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getMyEminationService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.email || !data.phone) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                })
            }
            else {
                let res = await db.User.findOne({
                    where: {
                        email: data.email,
                        phoneNumber: data.phone,
                    },
                    attributes: {
                        exclude: ['password', 'positionId', 'image', 'lastName', 'roleId']
                    },
                    include: [
                        {
                            model: db.Booking,
                            as: 'patientData',
                            attributes: ['reason', 'date', 'timeType', 'statusId', 'id', 'pay'],
                            include: [{
                                model: db.User,
                                as: 'doctorData',
                                attributes: ['firstName', 'lastName'],
                                include: [{
                                    model: db.doctorinfor,
                                    attributes: ['addressClinic', 'nameClinic'],
                                    include: [{
                                        model: db.Allcode,
                                        as: 'priceTypeData',
                                        attributes: ['valueVi', 'valueEn']
                                    }]
                                }]
                            },
                            {
                                model: db.Allcode,
                                as: 'timeTypeDataPatient',
                                attributes: ['valueVi', 'valueEn']
                            }]
                        }
                        ,
                        {
                            model: db.Allcode,
                            as: 'genderData',
                            attributes: ['valueVi', 'valueEn']
                        }
                    ],
                    raw: false,
                    nest: true,

                })
                if (!res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'no data!'
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errMessage: 'get data by email and phone success!',
                        data: res
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let postImagePaied = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.id || !data.imagePaied) {
                resolve({
                    errCode: -1,
                    errMessage: 'missing parameter!'
                })
            }
            else {
                let bookingData = await db.Booking.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false,
                })
                if (bookingData) {
                    bookingData.image = data.imagePaied;
                    bookingData.pay = true;
                    await bookingData.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'send image paied success!',
                    })
                }
                else (
                    resolve({
                        errCode: 2,
                        errMessage: "booking dose not exist!"
                    })
                )

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let postStatusId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.id || !data.statusId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter!'
                })
            }
            else {
                let res = await db.Booking.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false,
                })
                if (res) {
                    res.statusId = data.statusId;
                    res.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'post statusId success!'
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    postBookingApointment,
    postVerifyBooking,
    getMyEminationService,
    postImagePaied,
    postStatusId
}