# Checkout System
a checkout system that applies promotions on scanned items.

## How to run
App tested on node v 8.9.4 but should work on any later version
1. run npm install
1. make a copy of sample.env and rename it to .env
2. Set the port value in .env if needed
3. run npm start
4. use the examples provided in postman collection in "CHECKOUT_CODE_CHALLENGE.postman_collection.json"
**Note:**
  * please change the host port in the example to the port value you set in .env
  * Example "http://localhost:3000/checkout [Example 2]" does not produce the exact behavior: if a MackBook Pro ordered with a Raspberry PiB it does not discount the price of Raspberry PiB rather it adds a Raspberry PiB for free. This is a bug I did not get a chance to address
	* Please read the descriptions under the postman endpoints to know what the endpoint is about

## Discussion about the code
The core code is decoupled as much as possible by splitting it in two groups (1) service and (2) endpoints logic
### Services
Services are self-contained single (more precisely focused) purposes component which are agnostic to business logic. For example an inventory service provides a method to update quantity of items in the inventory, but it does not know (nor care) if this is being done as part of replenishing the inventory or placing an order. Those services are
	* inventory-service
	* promotions-service
	* logger-service
	* json-schema-validator-service
	* error-handler-service
### Endpoints logic
Those component are aware of the business logic, utilize and aggregate the services functionality to provide business logic such as placing an order

Decoupling the code this way helps making it more extensible. Also in case this application (or any other monolith) is to be broken down into microservices, decoupling the code this way makes the job smoother.

## Promotions as a rule engine
To allow more code extensibility, promotions are designed as a "plugins" pattern where there is a core rule engine that runs several plugins, those plugins are processors for different promotion types. The app also allows dynamically adding and removing plugins (rule processors)

## Some next steps
  * fix bug mentioned above
	* implement authorization (for users and application acting on behalf of users)
	* implement throttling
	* enhance promotion engine. Currently it is complexity m*n where m is number of scanned items and n is number of promotions. This could be improved, for example, by restructuring the promotion rules or indexing them

