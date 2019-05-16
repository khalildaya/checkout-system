const { createCheckoutRoutes } = require("./checkout");

module.exports = (app) => {
	createCheckoutRoutes(app);
}