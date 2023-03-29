import { reject } from "lodash";
import db from "../models/index";

let createClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.name || !data.address || !data.imageBase64 || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,

                })
                resolve({
                    errCode: 0,
                    errMessage: "Create specialty success!"
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getDetailClinicById = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing clinicId',
                })
            }
            else {
                let dataIntroduce = await db.Clinic.findOne({
                    where: {
                        id: clinicId,
                    },
                    attributes: ['descriptionMarkdown', 'descriptionHTML', 'name']
                })
                if (dataIntroduce) {
                    let doctorOfClinic = await db.doctorinfor.findAll({
                        where: {
                            clinicId: clinicId,
                        },
                    })
                    dataIntroduce.doctorOfClinic = doctorOfClinic;
                }
                resolve({
                    errCode: 0,
                    errMessage: 'get detail clinic success!',
                    data: dataIntroduce,
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let allClinic = await db.Clinic.findAll();
            if (allClinic) {
                resolve({
                    errCode: 0,
                    errMessage: 'find All Clinic Success!',
                    data: allClinic
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'Find All clinic Failed !'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let deleteClinicService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: {
                    id: id,
                }
            })
            if (!clinic) {
                resolve({
                    errCode: 1,
                    errMessage: 'clinic not exist!',
                })
            }
            else {
                await db.Clinic.destroy({
                    where: {
                        id: id
                    }
                })
                resolve({
                    errCode: 0,
                    errMessage: 'delete success!'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let editClinicService = (data) => {
    console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            let clinicEdit = await db.Clinic.findOne({
                where: {
                    id: data.id,
                },
                raw: false,
            })
            if (clinicEdit) {
                clinicEdit.id = data.id;
                clinicEdit.name = data.name;
                clinicEdit.address = data.address;
                clinicEdit.descriptionMarkdown = data.descriptionMarkdown;
                clinicEdit.descriptionHTML = data.descriptionHTML;
                clinicEdit.image = data.imageBase64;

                await clinicEdit.save();
                resolve({
                    errCode: 0,
                    errMessage: 'change success!'
                })

            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'clinic not exist!',
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createClinicService: createClinicService,
    getDetailClinicById: getDetailClinicById,
    getAllClinicService: getAllClinicService,
    deleteClinicService: deleteClinicService,
    editClinicService: editClinicService,
}