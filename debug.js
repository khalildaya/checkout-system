const rulesEngine = require("./promotions-service/rules-engine");
const RULE_TYPES = require("./promotions-service/rules-engine/rule-types");

const ruleBase = [{
	id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
	type: RULE_TYPES.BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE.id,
	description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
	boughItemSku: "43N23P", // Sku of item being bought
	boughItemCount: 1, // quantity of item being bought
	offeredItemSku: "234234", // Sku of item offered by promotion
	offeredItemCount: 1, // quantity of item offered by promotion
}]

rulesEngine.__internals__.setRuleBase(ruleBase);

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

const r = rulesEngine.applyPromotions(context);
console.log(JSON.stringify(r));