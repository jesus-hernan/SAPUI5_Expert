/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"logali/group/MyFirstProject/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
