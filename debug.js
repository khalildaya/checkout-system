"use strict";
const RULE_TYPES = require("./promotions-service/rules-engine/rule-types");
const { ERROR_PREFIX } = require("./promotions-service/rules-engine/constants").STRINGS;

const { assert, getActionsToApply, applyRuleActions } = require("./promotions-service/rules-engine/rules-processors/rprc-buy-count-of-x-get-count-of-y-free");
const rule = {
	id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
	type: RULE_TYPES.BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE.id,
	description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
	boughItemSku: "43N23P",
	boughItemCount: 1, // quantity of item being bought
	offeredItemSku: "234234", // Sku of item offered by promotion
	offeredItemCount: 1, // quantity of item offered by promotion
};

const context = {
	scannedItems: {
		"43N23P": {
			quantity: 10
		},
		"234234": {
			quantity: 6
		},
		"120P90": {
			quantity: 10
		}
	},
	scannedItemsPrice: 0
}
const assertRuleInfo = assert(context, rule);
JSON.stringify(assertRuleInfo);
const actionsToApply = getActionsToApply(assertRuleInfo);
JSON.stringify(actionsToApply);
const updateContext = applyRuleActions(context, actionsToApply);

JSON.stringify(updateContext);