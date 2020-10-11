// @ts-nocheck
sap.ui.define([
    "logali/group/MyFirstProject/model/formatter",
    "logali/group/MyFirstProject/controller/base.controller"
],
    function (Formatter, Base) {
        "use strict";

        function onInit() {
            this.bus = sap.ui.getCore().getEventBus();
        }

        function onCreateIncidence() {
            this.bus.publish("flexible", "onAddIncidence");
        }
        function onDeleteIncidence(oEvent) {
            var tableIncidence = this.getView().byId("tableIncidence");
            var rowIncidence = oEvent.getSource().getParent().getParent();
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var contextObj = rowIncidence.getBindingContext("incidenceModel").getObject();
            odata.splice(contextObj.index - 1, 1);
            for (var i in odata) {
                odata[i].index = parseInt(i) + 1;
            }
            incidenceModel.refresh();
            tableIncidence.removeContent(rowIncidence);
            for (var j in tableIncidence.getContent()) {
                tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
            }
        }

        return Base.extend("logali.group.MyFirstProject.controller.detailEmployee", {
            onInit: onInit,
            onCreateIncidence: onCreateIncidence,
            onDeleteIncidence: onDeleteIncidence,
            Formatter: Formatter
        });
    });