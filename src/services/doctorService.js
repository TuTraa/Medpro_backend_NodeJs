import db from "../models/index";
import _ from "lodash";
import emailService from "../services/emailService";
const { Op } = require('sequelize');
import moment from 'moment/moment';
// const Schedule = require('./scheduleDelete.js');

require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = limit => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true

            })
            resolve({
                errCode: 0,
                data: users,
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
let getAllDoctorSevice = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2',
                },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    })
}
let checkRequireInforDoctor = (data) => {
    let check = {
        islack: false,
        element: '',
    }
    let arrdata = ['selectedPrice', 'doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPayment', 'selectedProvince', 'nameClinic', 'adressClinic'];
    let length = arrdata.length;
    for (let i = 0; i < length; i++) {
        if (!data[arrdata[i]]) {
            check.islack = true;
            check.element = arrdata[i];
        }
    }
    return check;
}

let saveInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = checkRequireInforDoctor(inputData);

            if (check.islack) {
                resolve({
                    errCode: 1,
                    errMessage: `missing parameter : ${check.element}`
                })
            }
            else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                }
                else {

                    if (inputData.action === 'EDIT') {
                        let doctorMarkdown = await db.Markdown.findOne({
                            where: {
                                doctorId: inputData.doctorId
                            },
                            raw: false,
                        })
                        if (doctorMarkdown) {
                            doctorMarkdown.contentHTML = inputData.contentHTML;
                            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                            doctorMarkdown.description = inputData.description;
                            doctorMarkdown.updateAt = new Date();
                            await doctorMarkdown.save();
                        }
                    }

                }
                let isDoctorInfor = await db.doctorinfor.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false,
                })
                if (isDoctorInfor) {
                    isDoctorInfor.doctorId = inputData.doctorId;
                    isDoctorInfor.priceId = inputData.selectedPrice;
                    isDoctorInfor.paymentId = inputData.selectedPayment;
                    isDoctorInfor.provinceId = inputData.selectedProvince;
                    isDoctorInfor.nameClinic = inputData.nameClinic;
                    isDoctorInfor.addressClinic = inputData.adressClinic;
                    isDoctorInfor.specialtyId = inputData.specialtyId;
                    isDoctorInfor.clinicId = inputData.clinicId;
                    isDoctorInfor.note = inputData.note;
                    await isDoctorInfor.save();
                }
                else {
                    await db.doctorinfor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.adressClinic,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                        note: inputData.note,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'save infor doctor succeed',
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                where: {
                    id: inputId,
                },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: db.Markdown,
                    attributes: ['description', 'contentHTML', 'contentMarkdown']
                },
                { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                {
                    model: db.doctorinfor,
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'ProvinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ]
                }
                ],
                raw: false,
                nest: true,
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            if (!data) {
                data = {};
            }
            resolve({
                errCode: 0,
                data: data
            })

        }
        catch (e) {
            reject(e);
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required param!',
                })
            }
            else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {

                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //convert date
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                });
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                    // await db.Schedule.bulk;
                }
                resolve({
                    errCode: 0,
                    errMessage: 'oke'
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}
let bulkDeleteSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required param!',
                })
            }
            else {
                let schedule = data.arrSchedule;
                // console.log('sceduledelete:', schedule)
                // if (schedule && schedule.length > 0) {

                //     schedule = schedule.map(item => {
                //         item.maxNumber = MAX_NUMBER_SCHEDULE;
                //         return item;
                //     })
                // }
                //convert date
                // let existing = await db.Schedule.findAll({
                //     where: { doctorId: data.doctorId, date: data.date },
                //     attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                // });
                // let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                //     return a.timeType === b.timeType && +a.date === +b.date;
                // });
                // console.log(toCreate)
                //create data
                schedule.forEach(async (element) => {
                    await db.Schedule.destroy({
                        where: {
                            doctorId: element.doctorId,
                            date: element.date,
                            timeType: element.timeType,
                        }
                    });
                });

                resolve({
                    errCode: 0,
                    errMessage: 'oke'
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing requied parameter'
                })
            }
            else {
                let data = await db.Schedule.findAll({
                    where: {
                        date: date,
                        doctorId: doctorId,
                    }
                    ,
                    include: [{
                        model: db.Allcode,
                        as: 'timeTypeData',
                        attributes: ['valueVi', 'valueEn']
                    }
                    ],
                    raw: false,
                    nest: true,
                })
                if (!data) { data = [] }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {

        }
    })
}
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing requied parameter'
                })
            }
            else {
                let data = await db.doctorinfor.findOne({
                    where: {
                        doctorId: doctorId,
                    }
                    ,
                    include: [{
                        model: db.Allcode,
                        as: 'priceTypeData',
                        attributes: ['valueVi', 'valueEn']
                    }
                    ],
                    raw: false,
                    nest: true,
                })
                if (!data) { data = [] }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {

        }
    })
}
//profile modal
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [{
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown']
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.doctorinfor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'ProvinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    }
                    ],
                    raw: false,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        }
        catch (e) {
            reject(e);
        }
    })
}

let getListPatientForDoctorService = (doctorId, dataTime) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId && !dataTime) {
                resolve({
                    errCode: -1,
                    errMessage: 'missing parameter',
                })
            }
            else {
                let objectFind = { statusId: 'S2' };
                if (doctorId === 'All' && dataTime !== 'All') {
                    objectFind.date = dataTime
                }
                if (doctorId !== 'All' && dataTime === 'All') {
                    objectFind.doctorId = doctorId
                }
                if (doctorId !== 'All' && dataTime !== 'All') {
                    objectFind.date = dataTime;
                    objectFind.doctorId = doctorId
                }
                let allScheduleForDoctor = await db.Booking.findAll({
                    where: objectFind
                    ,
                    include: [{
                        model: db.User,
                        as: 'patientData',
                        attributes: ['firstName', 'email', 'address', 'gender', 'phoneNumber'],
                        include: [{
                            model: db.Allcode,
                            as: 'genderData',
                            attributes: ['valueVi', 'valueEn']
                        }]
                    }, {
                        model: db.Allcode,
                        as: 'timeTypeDataPatient',
                        attributes: ['valueVi', 'valueEn']
                    }
                    ],
                    raw: false,
                    nest: true,

                })
                if (allScheduleForDoctor) {
                    resolve({
                        errCode: 0,
                        errMessage: 'getAllInScheduleForDoctor Success!',
                        allScheduleForDoctor: allScheduleForDoctor,
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getListPatientForDoctorServiceS0 = (doctorId, dataTime, statusId, phone, history) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !dataTime || !statusId) {
                resolve({
                    errCode: -1,
                    errMessage: 'missing parameter',
                })
            }
            else {
                let yesterday = moment(new Date()).add(-1, 'days').startOf('day').valueOf();
                let today = moment(new Date()).startOf('day').valueOf();
                let patient = '';
                let objectFind = {
                    statusId: statusId,
                    date: {
                        [Op.gt]: yesterday,
                    }
                };
                if (history) {
                    objectFind.date = {
                        [Op.lt]: today,
                    }
                }
                if (dataTime !== 'All') {
                    objectFind.date = dataTime
                }
                if (doctorId !== 'All') {
                    objectFind.doctorId = doctorId
                }
                if (phone) {
                    patient = await db.User.findOne({
                        where: {
                            phoneNumber: phone,
                        },
                        attributes: ['id']
                    })
                    if (patient && patient.id) {
                        objectFind.patientId = patient.id;
                    }
                    if (!patient || !patient.id) {
                        objectFind.patientId = 'noId';
                    }
                }



                let allScheduleForDoctor = await db.Booking.findAll({
                    where: objectFind
                    ,
                    include: [{
                        model: db.User,
                        as: 'patientData',
                        attributes: ['firstName', 'email', 'address', 'gender', 'phoneNumber'],
                        include: [{
                            model: db.Allcode,
                            as: 'genderData',
                            attributes: ['valueVi', 'valueEn']
                        }]
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['firstName', 'lastName'],
                        include: [{
                            model: db.doctorinfor,
                            attributes: ['addressClinic', 'nameClinic']
                        }]
                    },
                    {
                        model: db.Allcode,
                        as: 'timeTypeDataPatient',
                        attributes: ['valueVi', 'valueEn']
                    }
                    ],
                    raw: false,
                    nest: true,

                })
                if (allScheduleForDoctor) {
                    resolve({
                        errCode: 0,
                        errMessage: 'getAllInScheduleForDoctor Success!',
                        allScheduleForDoctor: allScheduleForDoctor,
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required parameters'
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2',
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = "S3";
                    await appointment.save();
                }
                await emailService.sendAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: 'save and send email success!',
                    data: data,
                })
            }
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorSevice: getAllDoctorSevice,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctorService: getListPatientForDoctorService,
    sendRemedy, getListPatientForDoctorServiceS0, bulkDeleteSchedule
}