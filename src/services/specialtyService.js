import { reject } from "lodash";
import db from "../models/index";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.name || !data.imageBase64 || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
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



let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let AllSpecialty = await db.Specialty.findAll();
            if (AllSpecialty) {
                resolve({
                    data: AllSpecialty,
                    errCode: 0,
                    errMessage: "get all specialty success!",
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: "err form server!",
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {


                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })

                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'All') {
                        doctorSpecialty = await db.doctorinfor.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }
                    else {
                        doctorSpecialty = await db.doctorinfor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;
                }
                else { }
                resolve({
                    errCode: 0,
                    errMessage: "Create specialty success!",
                    data: data,
                })
            }
        }
        catch (e) {
            reject(e);
        }
    }
    )
}

module.exports = {
    createSpecialty, getAllSpecialty, getDetailSpecialtyById,
}