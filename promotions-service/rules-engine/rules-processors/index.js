/**
 * A module that dynamically loads all rule processors. By dynamically loading rule processors,
 * the app does not need to restart enabling a sort of hot-plugin of a rule processor.
 * for this to work, each rules processor needs to be defined in its own folder under "rues-processors" folder
 * the definition folder must start with a prefix "rprc-" and contain an "index.js" file which define the rule processor
 * */
"use strict";

const fs = require("fs");
const { RULE_PROCESSOR_DIR_PREFIX } = require("../constants");
const ERRORS = require("../errors");

module.exports = Object.freeze({
	buildRuleProcessors
});

/**
 * Returns an array fo rule processors folders based on provided prefix and path
 * @param {string} prefix prefix of rule processor folder 
 * @param {string} path path of folder containing all rule processors folders
 * @return {array} an array of folder paths containing rule processors to load dynamically
 */
function getAllRuleProcessorDirs(prefix, path) {
	const result = [];
	// Get all folders which names start with provided prefix
	const dirContent = fs.readdirSync(path);
	for (let i = 0; i < dirContent.length; i++) {
		const item = dirContent[i];
		const itemPath = `${path}/${item}`;

		// Add folder path to result if current item in provided directory is a directory and starts with provided prefix
		if (item.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && fs.statSync(itemPath).isDirectory()) {
			result.push(itemPath);
		}
	}
	return result;
}

/**
 * Returns an array of all rule processors
 * @param {array} ruleProcessorsDirs an array of all rule processors directories
 * @return {array} array fo rule processors
 */
function loadAllRuleProcessors(ruleProcessorsDirs) {
	const result = [];
	for (let i = 0; i < ruleProcessorsDirs.length; i++) {
		result.push(require(ruleProcessorsDirs[i]));
	}
	return result;
}

/**
 * Builds an object composed of all rule processors
 * the object properties are rule types and values are assert and apply function for each rule type
 * @return {object} a key value map where keys are rule types and values are assert and apply function for each rule type
 */
function buildRuleProcessors() {
	const ruleProcessorsDirs = getAllRuleProcessorDirs(RULE_PROCESSOR_DIR_PREFIX, "./");
	const ruleProcessors = loadAllRuleProcessors(ruleProcessorsDirs);
	const result = {};
	for (let i = 0; i < ruleProcessors.length; i++) {
		const ruleProcessor = ruleProcessors[i];

		// Get rule type id
		const ruleTypeId = ruleProcessor.ruleType && ruleProcessor.ruleType.id ? ruleProcessor.ruleType.id : null;

		// throw an error if rule type or rule type id was missing
		if (ruleTypeId === null) {
			throw Object.assign(ERRORS.RULE_TYPE_PROCESSOR_ALREADY_EXISTS, {
				details: {
					ruleType: ruleProcessor.ruleType
				}
			});
		}

		// throw an error if rule processor already exists for a given rule type
		if (result[ruleProcessor.ruleType]) {
			throw Object.assign(ERRORS.RULE_TYPE_PROCESSOR_ALREADY_EXISTS, {
				details: {
					ruleType: ruleProcessor.ruleType
				}
			});
		}
		result[ruleProcessor.ruleType] = {
			assert: ruleProcessor.assert,
			apply: ruleProcessor.apply
		}
	}
	return result;
}

