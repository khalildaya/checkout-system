/**
 * A module to dynamically load rules base.
 * Dynamically loading the rules will enable a sort of editing the rules on the fly instead of restarting the app
 * This is done only for the purpose of the code challenge, in a real life scenario, rules could be stored in a database,
 * updated and retrieved dynamically and cached to optimize performance
 * */
"use strict";
const RULE_TYPES = require("./rule-types");

const rules = [
	{
		id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
		type: RULE_TYPES.BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE.id,
		description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
		boughItemSku: "43N23P", // Sku of item being bought
		boughItemCount: 1, // quantity of item being bought
		offeredItemSku: "234234", // Sku of item offered by promotion
		offeredItemCount: 1, // quantity of item offered by promotion
	},
	{
		id: "69252c48-98a1-4873-a28d-82d320da88c5",
		type: RULE_TYPES.BUY_Y_OF_X_FOR_THE_PRICE_OF_Z.id,
		description: "Buy 3 google Homes for the price of 2",
		boughItemSku: "120P90", // Sku of item being bought
		boughItemCount: 3, // quantity of item being bought
		forPriceOfCount: 2, // quantity of item being charged as part of promotion
	},
	/* {
		id: "16cc6b60-e963-4855-bc91-a10020fcdb01",
		type: RULE_TYPES.BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X.id,
		description: "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers",
		boughItemSku: "A304SD", // Sku of item being bought
		boughItemCount: 3, // quantity of item being bought
		discountPercent: 10, // percent to discount from price of all occurrences of bought item in scope of this promotion
	}, */
];

module.exports = Object.freeze(rules);