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

module.exports = {
    createClinicService: createClinicService,
    getDetailClinicById: getDetailClinicById,
    getAllClinicService: getAllClinicService,
}