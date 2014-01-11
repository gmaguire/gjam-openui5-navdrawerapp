jQuery.sap.require("sap.m.InstanceManager");

sap.ui.core.Control.extend("gjam.openui5.NavDrawerApp", {
    metadata: {
        properties: {

        },
        aggregations: {
            menu: { type: "sap.ui.core.Control", multiple: false },
            pages: { type: "sap.ui.core.Control", multiple: true }
        }
    },

    init: function () {
        this._app = new sap.m.App();

        var bus = sap.ui.getCore().getEventBus();
        bus.subscribe("nav", "to", this._navTo, this);
        bus.subscribe("nav", "back", this._navBack, this);
        bus.subscribe("nav", "togglemenu", this._toggleMenu, this);
    },

    _navBack: function () {
        var app = this._app;
        app.back();
        this._closeMenu();
    },

    _closePopoversAndDialogs: function () {
        if (sap.m.InstanceManager.hasOpenDialog()) {
            sap.m.InstanceManager.closeAllDialogs();
        }

        if (sap.m.InstanceManager.hasOpenPopover()) {
            sap.m.InstanceManager.closeAllPopovers();
        }
    },

    _navTo: function (channelId, eventId, eventData) {
        var viewId = "view." + eventData.id,
            data = eventData.data;

        if (viewId === undefined) {
            jQuery.sap.log.error("navTo failed due to missing id");
            return;
        }

        this._closePopoversAndDialogs();

        if (this._app.getPage(viewId) === null) {
            this._app.addPage(sap.ui.htmlview(viewId, viewId));
        }

        this._app.to(viewId, "fade", data);

        jQuery.sap.log.info("navTo '" + viewId);

        this._closeMenu();
    },

    _toggleMenu: function () {
        if ($(".nav-app-container").hasClass("nav-app-container-opened")) {
            this._closeMenu();
        }
        else {
            this._openMenu();
        }
    },

    _openMenu: function () {
        $(".nav-app-container").addClass("nav-app-container-opened");
        $(".nav-drawer-app").addClass("nav-app-container-opened");
        $(".nav-menu-container").addClass("nav-menu-container-opened");
    },

    _closeMenu: function () {
        $(".nav-menu-container").removeClass("nav-menu-container-opened");
        $(".nav-app-container").removeClass("nav-app-container-opened");
        $(".nav-drawer-app").removeClass("nav-app-container-opened");
    },

    renderer: function (renderManager, control) {
        var pages = control.getAggregation("pages");

        for (var i = 0; i < pages.length; i++) {
            control._app.addPage(pages[i]);
        }

        renderManager.write("<div");
        renderManager.writeControlData(control);
        renderManager.writeClasses()
        renderManager.addClass("nav-drawer-app");
        renderManager.write(">");

        renderManager.write("<div class='nav-app-container'>");
        renderManager.renderControl(control._app);
        renderManager.write("</div>");

        renderManager.write("<div class='nav-menu-container'>");
        renderManager.renderControl(control.getAggregation("menu"));
        renderManager.write("</div>");

        renderManager.write("</div>");
    }
});