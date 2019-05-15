"use strict";

const { schemas, schemaIds } = require("./json-schemas");

const Ajv = require("ajv");
const ajv = new Ajv({
	removeAdditional: true,
	useDefaults: true,
	schemas
});

module.exports = Object.freeze({
	validateJsonSchema,
	schemaIds
});

function validateJsonSchema(json, schemaId) {
	const validate = ajv.getSchema(schemaId);
	validate(json);
	const { errors } = validate;
	if (errors && errors.length > 0) {
		return {
			isValid: false,
			errors
		}
	}
	return {
		isValid: true
	}
}