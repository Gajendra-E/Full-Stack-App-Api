// Parse command line arguments using yargs
var argv = require("yargs")
	.command("master", "Load DB", function (yargs) { })
	.help("help").argv;
var command = argv._[0];
import Excel from "exceljs";
import db from "../src/models";
import { registerUser } from '../src/helpers/userHelper'

const loadMasterTable = () => {
	return new Promise(async (resolve, reject) => {
		console.log("-----===================")
		try {
            let workbook = new Excel.Workbook();
			await workbook.xlsx.readFile('./dist/data/data_collection_app.xlsx')
			console.log("\n================== Master tables started loading ====================\n");
			let postRoles = await loadRoles(workbook);
			console.log(postRoles);
			let postUsers = await loadUsers(workbook);
			console.log(postUsers);
			console.log("==================Master tables loaded====================");
			resolve("Success");
			process.exit(0);
		} catch (error) {
			reject("Error ==> " + error);
		}
    });
}

const loadRoles = (workbook) => {
	console.log("jjjjjjjjjjjjjjjj---------------")
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("userRole");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let roleArray = [];
		let existRoleData = 0;
		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let roleObj = {};
					roleObj.code = row.getCell(2).value;
					roleObj.name = row.getCell(1).value;
					roleObj.status = row.getCell(3).value;
					roleArray.push(roleObj);
					if (row === lastRow) {
						if (!isRejected === true) {
							for (let role of roleArray) {
								let fetchRole = await db.Role.findOne({
									where: {
										code: role.code
									}
								})
								if (fetchRole === null) {
									await db.Role.create({
                                        name: role.name,
										code: role.code,
										status: role.status,
									});
								}else{
									existRoleData = (existRoleData+1);	
								}
							}
							let message = existRoleData === roleArray.length ? "Role data already exist" : existRoleData === 0 ? "Role data loaded successfully" : `${(roleArray.length - existRoleData)}/${roleArray.length} Role data loaded successfully`
							resolve(message);
						}
					}
				}
			});
		} catch (error) {
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!===> " + error);
		}
	});
};

const loadUsers = (workbook) => {
    return new Promise((resolve, reject) => {
        let worksheet = workbook.getWorksheet('users');
        let lastRow = worksheet.lastRow;
        let isRejected = false;
        let userArray = [];
        try {
            worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                if (rowNumber > 1) {
                    let userObj = {};
                    userObj.first_name = row.getCell(1).value;
                    userObj.last_name = row.getCell(2).value;
                    userObj.email = row.getCell(3).value;
                    userObj.password = row.getCell(4).value;
                    userObj.user_type = row.getCell(5).value;
					userObj.status = row.getCell(6).value;
                    userArray.push(userObj);
                    if (row === lastRow) {
                        if (!isRejected === true) {
                            for (let user of  userArray) {
									let newUser = await registerUser(user);                            
                            }
                            resolve("User table loaded successfully");
                        }
                    }
                }
            });
        } catch (error) {
            resolve("Error while loading User Table")
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!===> " + error)
        }
    });
}

if (command === "master") {
	try {
		loadMasterTable().then((result) => {
			// console.log('Finished Loading');
			process.exit();
		});
	} catch (error) {
		console.log("Unable to master table");
	}
}
