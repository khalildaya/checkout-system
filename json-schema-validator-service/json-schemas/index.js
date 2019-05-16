"use strict";

const RULE_TYPE_BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE = "RuleType-buyCountOfXGetCountOfYFree";
const CONTEXT = "context";
const CHECKOUT_INPUT = "checkout-input";
const RULE_TYPE_BUY_Y_OF_X_FOR_THE_PRICE_OF_Z = "buyYOfXForPriceOfZ";

module.exports = Object.freeze({
	schemaIds: {
		CONTEXT,
		RULE_TYPE_BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE,
		RULE_TYPE_BUY_Y_OF_X_FOR_THE_PRICE_OF_Z
	},
	schemas: [ // Ideally the schemas below are stored and retrieved from a database
		{
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": RULE_TYPE_BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE,
			"type": "object",
			"title": "buyCountOfXGetCountOfYFree rule type",
			"additionalProperties": false,
			"properties": {
				"id": {
					"type": "string",
					"format": "uuid",
					"title": "Universal identifier of rule"
				},
				"type": {
					"type": "string",
					"title": "rule type"
				},
				"description": {
					"type": "string",
					"title": "rule description"
				},
				"boughItemSku": {
					"type": "string",
					"title": "Sku of item being bought"
				},
				"boughItemCount": {
					"type": "integer",
					"title": "quantity of item being bought"
				},
				"offeredItemSku": {
					"type": "string",
					"title": "Sku of item offered by promotion"
				},
				"offeredItemCount": {
					"type": "integer",
					"title": "quantity of item offered by promotion"
				},
			},
			"required": [
				"id",
				"type",
				"description",
				"boughItemSku",
				"boughItemCount",
				"offeredItemSku",
				"offeredItemCount"
			]
		},
		{
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": CONTEXT,
			"title": "Provided context i.e. original scanned items",
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"scannedItems": {
					"type": "object",
					"title": "Original scanned items",
				},
				"scannedItemsPrice": {
					"type": "number",
					"title": "Original scanned items price",
				}
			},
			"required": [
				"scannedItems",
				"scannedItemsPrice"
			]
		},
		{
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": CHECKOUT_INPUT,
			"type": "array",
			"title": "Scanned items",
			"additionalProperties": false,
			"items": {
				"type": "string",
			}
		},
		{
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": RULE_TYPE_BUY_Y_OF_X_FOR_THE_PRICE_OF_Z,
			"type": "object",
			"title": "buyYOfXForPriceOfZ rule type",
			"additionalProperties": false,
			"properties": {
				"id": {
					"type": "string",
					"format": "uuid",
					"title": "Universal identifier of rule"
				},
				"type": {
					"type": "string",
					"title": "rule type"
				},
				"description": {
					"type": "string",
					"title": "rule description"
				},
				"boughItemSku": {
					"type": "string",
					"title": "Sku of item being bought"
				},
				"boughItemCount": {
					"type": "integer",
					"title": "quantity of item being bought"
				},
				"forPriceOfCount": {
					"type": "integer",
					"title": "quantity of item being charged as part of promotion"
				},
			},
			"required": [
				"id",
				"type",
				"description",
				"boughItemSku",
				"boughItemCount",
				"forPriceOfCount"
			]
		},
	]
});