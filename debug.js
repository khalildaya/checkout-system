const { assert, getActionsToApply, applyRuleActions } = require("./promotions-service/rules-engine/rules-processors/rprc-buy-y-of-x-get-for-price-of-z");
		const rule = {
			id: "69252c48-98a1-4873-a28d-82d320da88c5",
			type: "buyYOfXForPriceOfZ",
			description: "Buy 3 google Homes for the price of 2",
			boughItemSku: "120P90", // Sku of item being bought
			boughItemCount: 3, // quantity of item being bought
			forPriceOfCount: 2, // quantity of item being charged as part of promotion
		};

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10,
					price: 4
				},
				"234234": {
					quantity: 6,
					price: 6
				},
				"120P90": {
					quantity: 10,
					price: 30
				}
			},
			scannedItemsPrice: 40
		}

		const actionsToApply = getActionsToApply(assert(context, rule));
		const updateContext = applyRuleActions(context, actionsToApply);

		console.log(updateContext);