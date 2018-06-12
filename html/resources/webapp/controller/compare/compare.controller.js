sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function(Controller, MessageToast, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("movielens.html.controller.compare.compare", {
		onInit: function() {
			if (typeof sap.ui.getCore().getModel() === 'undefined') {
				sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel());
			}
			this.getView().setModel(new sap.ui.model.json.JSONModel(), "item");
		},
		onBeforeRendering: function() {
			this.selectItemUser("");
			this.selectItemMovie("");
		},
		formatEpoch: function(value) {
			var result = "";
			if (value !== "undefined" && this.isNumeric(value)) {
				result = new Date(value * 1000).toDateString();
			}
			return result;
		},
		formatNumber: function(value) {
			var result = "";
			if (value !== "undefined" && this.isNumeric(value)) {
				result = Number(value).toFixed(2);
			}
			return result;
		},
		formatPercent: function(value) {
			var result = "";
			if (value !== "undefined" && this.isNumeric(value)) {
				result = Number(value * 100).toFixed(2) + "%";
			}
			return result;
		},
		isNumeric: function(oValue) {
			var tmp = oValue && oValue.toString();
			return !jQuery.isArray(oValue) && (tmp - parseFloat(tmp) + 1) >= 0;
		},
		selectItemUser: function(value) {
			var oItemModel = this.getView().getModel("item");
			var tableFilters = [];

			// only allow numeric direct input
			var itemId = -1;
			if (this.isNumeric(value)) {
				// get the current model
				var oModel = this.getView().getModel();
				var item = oModel.getProperty("/ratings_user(" + value + ")", this, true);
				if (item !== "undefined") {
					itemId = item.USERID;
					oItemModel.setProperty("/selectedItemId", item.USERID);
					oItemModel.setProperty("/item", item);
				}
			}
			tableFilters = [
				new Filter([
					new Filter("USERID", FilterOperator.EQ, itemId)
				], false)
			];
			this.getView().byId("history").getBinding("rows").filter(tableFilters);
			this.getView().byId("recommendation_apl").getBinding("rows").filter(tableFilters);
			this.getView().byId("recommendation_pal").getBinding("rows").filter(tableFilters);
		},
		selectItemMovie: function(value) {
			var oItemModel = this.getView().getModel("item");
			var tableFilters = [];

			// only allow numeric direct input
			var itemId = -1;
			if (this.isNumeric(value)) {
				// get the current model
				var oModel = this.getView().getModel();
				var item = oModel.getProperty("/ratings_movie(" + value + ")", this, true);
				if (item !== "undefined") {
					itemId = item.MOVIEID;
					oItemModel.setProperty("/selectedItemId", item.MOVIEID);
					oItemModel.setProperty("/item", item);
				}
			}

			tableFilters = [
				new Filter([
					new Filter("MOVIEID", FilterOperator.EQ, itemId)
				], false)
			];
			this.getView().byId("history").getBinding("rows").filter(tableFilters);
			this.getView().byId("recommendation_apl").getBinding("rows").filter(tableFilters);
			this.getView().byId("recommendation_pal").getBinding("rows").filter(tableFilters);
		},
		onSubmit: function(oEvent) {
			var sType = oEvent.getSource().getCustomData()[0].getValue();
			if (sType === "user") {
				this.selectItemUser(oEvent.getParameter("value"));
			} else if (sType === "movie") {
				this.selectItemMovie(oEvent.getParameter("value"));
			}
		},
		onSuggestionItemSelected: function(oEvent) {
			if (oEvent.getParameter("selectedItem") !== null) {
				var sType = oEvent.getSource().getCustomData()[0].getValue();
				if (sType === "user") {
					this.selectItemUser(oEvent.getParameter("selectedItem").getKey());
				} else if (sType === "movie") {
					this.selectItemMovie(oEvent.getParameter("selectedItem").getKey());
				}
			}
		},
		onSuggestUser: function(oEvent) {
			var value = oEvent.getSource().getValue();
			var filters = [];
			if (value) {
				// don't search numeric field if the input is not numerci
				if (this.isNumeric(value)) {
					filters.push(new Filter("USERID", FilterOperator.EQ, value));
					filters.push(new Filter("RATING_COUNT", FilterOperator.EQ, value));
				}
				filters.push(new Filter("tolower(DESCRIPTION)", FilterOperator.Contains, "'" + value.toLowerCase() + "'"));
			}
			this.getView().byId("input").getBinding("suggestionItems").filter([new Filter(filters, false)]);
		},
		onSuggestMovie: function(oEvent) {
			var value = oEvent.getSource().getValue();
			var filters = [];
			if (value) {
				// don't search numeric field if the input is not numerci
				if (this.isNumeric(value)) {
					filters.push(new Filter("MOVIEID", FilterOperator.EQ, value));
					filters.push(new Filter("RATING_COUNT", FilterOperator.EQ, value));
				}
				filters.push(new Filter("tolower(TITLE)", FilterOperator.Contains, "'" + value.toLowerCase() + "'"));
				filters.push(new Filter("tolower(DESCRIPTION)", FilterOperator.Contains, "'" + value.toLowerCase() + "'"));
			}
			this.getView().byId("input").getBinding("suggestionItems").filter([new Filter(filters, false)]);
		}
	});
});