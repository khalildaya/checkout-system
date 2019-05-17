const { createCheckoutRoutes } = require("./checkout");
const { createPromotionsRoutes } = require("./reload-promotions");

module.exports = (app) => {
	createCheckoutRoutes(app);
	createPromotionsRoutes(app);
}