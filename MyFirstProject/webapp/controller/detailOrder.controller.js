// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"

], function (Controller, History) {
    "use strict";

    function _onObjectMatched(oEvent) {
        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
            model: "odataModel"
        });
        this.onClear();
    }
    function onInit() {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("detailOrder").attachPatternMatched(_onObjectMatched, this);
    }
    function onBack(oEvent) {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMain", true);
        }
    }
    function onClear() {
        var signature = this.byId("signature");
        signature.clear();
    }

    function factoryOrderDetail(sId, oContext) {
        var contextObject = oContext.getObject();
        contextObject.Currency = "EUR";
        var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");
        if (contextObject.Quantity <= unitsInStock) {
            var objectListItem = new sap.m.ObjectListItem(
                {
                    title: "{odataModel>/Products(" + contextObject.ProductID + ")/ProductName} ({odataModel>Quantity})",
                    number: "{parts:[{path:'odataModel>UnitPrice'},{path: 'odataModel>Currency'}],type: 'sap.ui.model.type.Currency',formatOptions : {showMeasure : false}}",
                    numberUnit: "{odataModel>Currency}"
                }
            );
            return objectListItem;
        } else {
            var customListItem = new sap.m.CustomListItem({
                content: [
                    new sap.m.Bar({
                        contentLeft: new sap.m.Label({ text: "{odataModel>/Products(" + contextObject.ProductID + ")/ProductName} ({odataModel>Quantity})" }),
                        contentMiddle: new sap.m.ObjectStatus({ text: "{i18n>noStockSuficiente}", state: "Error" }),
                        contentRight: new sap.m.Label({ text: "{parts: [{path: 'odataModel>UnitPrice'},{path: 'odataModel>Currency'}],type: 'sap.ui.model.type.Currency'}" })
                    })
                ]
            });
            return customListItem;
        }
    }

    return Controller.extend("logali.group.MyFirstProject.controller.detailOrder", {
        onInit: onInit,
        onClear: onClear,
        onBack: onBack,
		factoryOrderDetail : factoryOrderDetail
    });
});