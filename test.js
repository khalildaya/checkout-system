const ruleEngine = require("./promotions-service/rules-engine");

ruleEngine.applyPromotions({
	scannedItems: {
		"43N23P": {
			quantity: 1,
			price: 45
		},
		"120P90": {
			quantity: 3,
			price: 45
		}
	}
});