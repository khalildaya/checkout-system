const fs = require("fs");

function getAllRulesProcessors(prefix, path) {
	const fileNames = fs.readdirSync(path);
	for (let i = 0; i < fileNames.length; i++) {
		if (fs.statSync(path + "/" + fileNames[i]).isDirectory()) {
			console.log(path + "/" + fileNames[i] + " is dir");
		}
	}
}

getAllRulesProcessors("", "./promotions-service");