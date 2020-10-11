// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    function onBeforeRendering() {
        var oJsonModel = new sap.ui.model.json.JSONModel();
        var oView = this.getView();
        var i18nBundle = oView.getModel("i18n").getResourceBundle();
        var oJson = {
            EmployeeID: "5",
            Country: "UK",
            listCountry: [
                {
                    key: "USA",
                    text: i18nBundle.getText("usa")
                },
                {
                    key: "UK",
                    text: i18nBundle.getText("uk")
                },
                {
                    key: "Spain",
                    text: i18nBundle.getText("spain")
                }
            ]
        };
        oJsonModel.setData(oJson);
        oView.setModel(oJsonModel);


        //Uso de varios modelos
        var oJsonModelEmployees = new sap.ui.model.json.JSONModel();
        var oJsonEmployees = [
            {
                EmployeeID: "1",
                LastName: "García Lopez",
                FirstName: "María",
                Country: "Spain",
                City: "Madrid",
                PostalCode: "28021",
                Orders: [
                    {
                        OrderID: "208",
                        Freight: "65",
                        ShipAddress: "Calle Alcala"
                    },
                    {
                        OrderID: "2096",
                        Freight: "21",
                        ShipAddress: "Calle Mayor"
                    }
                ]
            },
            {
                EmployeeID: "2",
                LastName: "Fernandez Díaz",
                FirstName: "Pedro",
                Country: "Spain",
                City: "Granada",
                PostalCode: "18008",
                Orders: [
                    {
                        OrderID: "1056",
                        Freight: "78",
                        ShipAddress: "Calle Elvira"
                    },
                    {
                        OrderID: "6731",
                        Freight: "90",
                        ShipAddress: "Calle Abad"
                    }
                ]
            },
            {
                EmployeeID: "3",
                LastName: "Davolio",
                FirstName: "Nancy",
                Country: "USA",
                City: "Seattle",
                PostalCode: "98052",
                Orders: [
                    {
                        OrderID: "789",
                        Freight: "34",
                        ShipAddress: "1029 - 12th Ave. S."
                    },
                    {
                        OrderID: "3057",
                        Freight: "12",
                        ShipAddress: "2732 Baker Blvd."
                    }
                ]
            },
            {
                EmployeeID: "4",
                LastName: "Peacock",
                FirstName: "Margaret",
                Country: "USA",
                City: "Redmond",
                PostalCode: "08025",
                Orders: [
                    {
                        OrderID: "100",
                        Freight: "83",
                        ShipAddress: "187 Suffolk Ln."
                    },
                    {
                        OrderID: "209",
                        Freight: "52",
                        ShipAddress: "87 Polk St. Suite 5"
                    }
                ]
            },
            {
                EmployeeID: "5",
                LastName: "Buchanan",
                FirstName: "Steven",
                Country: "UK",
                City: "London",
                PostalCode: "67059",
                Orders: [
                    {
                        OrderID: "10",
                        Freight: "57",
                        ShipAddress: "Brook Farm Stratford St. Mary"
                    },
                    {
                        OrderID: "2010",
                        Freight: "89",
                        ShipAddress: "Fauntleroy Circus"
                    }
                ]
            }
        ];

        oJsonModelEmployees.setData(oJsonEmployees);

        oView.setModel(oJsonModelEmployees, "oJsonModelEmployees");

        // Uso de json para visibilidad 
        var oJsonModelConfig = new sap.ui.model.json.JSONModel({
            visibleID: true,
            visibleName: true,
            visibleCountry: true,
            visibleCity: false,
            visibleBtnShowCity: true,
            visibleBtnHideCity: false,
            layout: "OneColumn"
        });
        oView.setModel(oJsonModelConfig, "oJsonModelConfig");

        /*Registramos eventos en el bus para poder llamarlos desde otros controladores*/
        this.bus = sap.ui.getCore().getEventBus();
		/*Registramos la funcion setDetailPage, para llamarlo desde la vista Maestra para informar al Flexible column que ha de
		 convertirse en dos columnas para mostrar el detalle*/
        this.bus.subscribe("flexible", "showDetailEmployee", this.showDetailEmployee, this);
        this.bus.subscribe("flexible", "onAddIncidence", this.onAddIncidence, this);
    }

    function showDetailEmployee(category, nameEvent, _path) {
        var detailView = this.byId("detailEmployeeView");
        detailView.bindElement("odataModel>" + _path);
        this.getView().getModel("oJsonModelConfig").setProperty("/layout", "TwoColumnsMidExpanded");
        var incidenceModel = new sap.ui.model.json.JSONModel([]);
        detailView.setModel(incidenceModel, "incidenceModel");
        detailView.byId("tableIncidence").removeAllContent();
    }

    function onAddIncidence() {
        var detailView = this.byId("detailEmployeeView");
        var tableIncidence = detailView.byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logali.group.MyFirstProject.fragment.newIncidence", detailView.getController());
        var incidenceModel = detailView.getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    }

    return Controller.extend("logali.group.MyFirstProject.controller.main", {
        onBeforeRendering : onBeforeRendering,
        showDetailEmployee: showDetailEmployee,
        onAddIncidence: onAddIncidence
    });
});