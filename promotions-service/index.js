"use strict";

const {
	loadRuleBase,
	loadRuleProcessor,
	applyPromotions,
} = require("./rules-engine");

module.exports = Object.freeze({
	applyPromotions,
	reloadPromotions
});

// Reload promotions to enable adding rules without restarting app
function reloadPromotions() {
	loadRuleBase();
	loadRuleProcessor();
}