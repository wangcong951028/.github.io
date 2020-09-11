!function($) {
        "use strict";
        $.Zebra_Dialog = function() {
            var defaults = {
                    animation_speed_hide: 250,
                    animation_speed_show: 0,
                    auto_close: !1,
                    buttons: !0,
                    center_buttons: !1,
                    custom_class: !1,
                    keyboard: !0,
                    max_height: 0,
                    message: "",
                    modal: !0,
                    overlay_close: !0,
                    overlay_opacity: ".9",
                    position: "center",
                    reposition_speed: 500,
                    show_close_button: !0,
                    source: !1,
                    title: "",
                    type: "information",
                    vcenter_short_message: !0,
                    width: 0,
                    onClose: null
                },
                plugin = this,
                options = {},
                timeout;
            plugin.settings = {},
            "string" == typeof arguments[0] && (options.message = arguments[0]),
            ("object" == typeof arguments[0] || "object" == typeof arguments[1]) && (options = $.extend(options, "object" == typeof arguments[0] ? arguments[0] : arguments[1])),
                plugin.init = function() {
                    var a;
                    plugin.settings = $.extend({},
                        defaults, options),
                        plugin.isIE6 = "explorer" == browser.name && 6 == browser.version || !1,
                    plugin.settings.modal && (plugin.overlay = $("<div>", {
                        "class": "ZebraDialogOverlay"
                    }).css({
                        position: plugin.isIE6 ? "absolute": "fixed",
                        left: 0,
                        top: 0,
                        opacity: plugin.settings.overlay_opacity
                    }), plugin.settings.overlay_close && plugin.overlay.bind("click",
                        function() {
                            plugin.close()
                        }), plugin.overlay.appendTo("body")),
                        plugin.dialog = $("<div>", {
                            "class": "ZebraDialog" + (plugin.settings.custom_class ? " " + plugin.settings.custom_class: "")
                        }).css({
                            position: plugin.isIE6 ? "absolute": "fixed",
                            left: 0,
                            top: 0,
                            visibility: "hidden"
                        }),
                    !plugin.settings.buttons && plugin.settings.auto_close && plugin.dialog.attr("id", "ZebraDialog_" + Math.floor(9999999 * Math.random()));
                    var b = parseInt(plugin.settings.width, 10); ! isNaN(b) && b == plugin.settings.width && b.toString() == plugin.settings.width.toString() && b > 0 && plugin.dialog.css({
                        width: plugin.settings.width
                    }),
                    plugin.settings.title && (a = $("<h3>", {
                        "class": "ZebraDialog_Title"
                    }).html(plugin.settings.title).appendTo(plugin.dialog));
                    var c = get_buttons(),
                        d = $("<div>", {
                            "class": "ZebraDialog_BodyOuter" + (plugin.settings.title ? "": " ZebraDialog_NoTitle") + (c ? "": " ZebraDialog_NoButtons")
                        }).appendTo(plugin.dialog);
                    if (plugin.message = $("<div>", {
                            "class": "ZebraDialog_Body" + (get_type() !== !1 ? " ZebraDialog_Icon ZebraDialog_" + get_type() : "")
                        }), plugin.settings.max_height > 0 && (plugin.message.css("max-height", plugin.settings.max_height), plugin.isIE6 && plugin.message.attr("style", "height: expression(this.scrollHeight > " + plugin.settings.max_height + ' ? "' + plugin.settings.max_height + 'px" : "85px")')), plugin.settings.vcenter_short_message ? $("<div>").html(plugin.settings.message).appendTo(plugin.message) : plugin.message.html(plugin.settings.message), plugin.settings.source && "object" == typeof plugin.settings.source) {
                        var e = plugin.settings.vcenter_short_message ? $("div:first", plugin.message) : plugin.message;
                        for (var f in plugin.settings.source) switch (f) {
                            case "ajax":
                                var g = "string" == typeof plugin.settings.source[f] ? {
                                        url: plugin.settings.source[f]
                                    }: plugin.settings.source[f],
                                    h = $("<div>").attr("class", "ZebraDialog_Preloader").appendTo(e);
                                g.success = function(a) {
                                    h.remove(),
                                        e.append(a),
                                        draw(!1)
                                },
                                    $.ajax(g);
                                break;
                            case "iframe":
                                var i = {
                                        width: "100%",
                                        height: "100%",
                                        marginheight: "0",
                                        marginwidth: "0",
                                        frameborder: "0"
                                    },
                                    j = $.extend(i, "string" == typeof plugin.settings.source[f] ? {
                                        src: plugin.settings.source[f]
                                    }: plugin.settings.source[f]);
                                e.append($("<iframe>").attr(j));
                                break;
                            case "inline":
                                e.append(plugin.settings.source[f])
                        }
                    }
                    if (plugin.message.appendTo(d), c) {
                        c.reverse();
                        var k = $("<div>", {
                            "class": "ZebraDialog_Buttons"
                        }).appendTo(plugin.dialog);
                        $.each(c,
                            function(a, b) {
                                var c = $("<a>", {
                                    href: "javascript:void(0)",
                                    "class": "ZebraDialog_Button_" + a
                                });
                                $.isPlainObject(b) ? c.html(b.caption) : c.html(b),
                                    c.bind("click",
                                        function() {
                                            var a = !0;
                                            void 0 !== b.callback && (a = b.callback(plugin.dialog)),
                                            a !== !1 && plugin.close(void 0 !== b.caption ? b.caption: b)
                                        }),
                                    c.appendTo(k)
                            }),
                            k.wrap($("<div>").addClass("ZebraDialog_ButtonsOuter" + (plugin.settings.center_buttons ? " ZebraDialog_Buttons_Centered": "")))
                    }
                    if (plugin.dialog.appendTo("body"), plugin.settings.show_close_button) {
                        var l = $('<a href="javascript:void(0)" class="ZebraDialog_Close">&times;</a>').bind("click",
                            function(a) {
                                a.preventDefault(),
                                    plugin.close()
                            }).appendTo(a ? a: plugin.message);
                        a && l.css({
                            right: parseInt(a.css("paddingRight"), 10),
                            top: (parseInt(a.css("height"), 10) + parseInt(a.css("paddingTop"), 10) + parseInt(a.css("paddingBottom"), 10) - l.height()) / 2
                        })
                    }
                    return $(window).bind("resize.Zebra_Dialog",
                        function() {
                            clearTimeout(timeout),
                                timeout = setTimeout(function() {
                                        draw()
                                    },100)
                        }),
                    plugin.settings.keyboard && $(document).bind("keyup.Zebra_Dialog",
                        function(a) {
                            return 27 == a.which && plugin.close(),!0
                        }),
                    plugin.isIE6 && $(window).bind("scroll.Zebra_Dialog",
                        function() {
                            emulate_fixed_position()
                        }),
                    plugin.settings.auto_close !== !1 && (plugin.dialog.bind("click",
                        function() {
                            clearTimeout(plugin.timeout),plugin.close()
                        }), plugin.timeout = setTimeout(plugin.close, plugin.settings.auto_close)),draw(!1),plugin},
                plugin.close = function(a) {
                    $(document).unbind(".Zebra_Dialog"),
                        $(window).unbind(".Zebra_Dialog"),
                    plugin.overlay && plugin.overlay.animate({
                            opacity: 0
                        },
                        plugin.settings.animation_speed_hide,
                        function() {
                            plugin.overlay.remove()
                        }),
                        plugin.dialog.animate({
                                top: 0,
                                opacity: 0
                            },
                            plugin.settings.animation_speed_hide,
                            function() {
                                plugin.dialog.remove(),
                                plugin.settings.onClose && "function" == typeof plugin.settings.onClose && plugin.settings.onClose(void 0 !== a ? a: "")
                            })
                };
            var draw = function() {
                    var viewport_width = $(window).width(),
                        viewport_height = $(window).height(),
                        dialog_width = plugin.dialog.width(),
                        dialog_height = plugin.dialog.height(),
                        values = {
                            left: 0,
                            top: 0,
                            right: viewport_width - dialog_width,
                            bottom: viewport_height - dialog_height,
                            center: (viewport_width - dialog_width) / 2,
                            middle: (viewport_height - dialog_height) / 2
                        };
                    if (plugin.dialog_left = void 0, plugin.dialog_top = void 0, $.isArray(plugin.settings.position) && 2 == plugin.settings.position.length && "string" == typeof plugin.settings.position[0] && plugin.settings.position[0].match(/^(left|right|center)[\s0-9\+\-]*$/) && "string" == typeof plugin.settings.position[1] && plugin.settings.position[1].match(/^(top|bottom|middle)[\s0-9\+\-]*$/) && (plugin.settings.position[0] = plugin.settings.position[0].toLowerCase(), plugin.settings.position[1] = plugin.settings.position[1].toLowerCase(), $.each(values,
                            function(index, value) {
                                for (var i = 0; 2 > i; i++) {
                                    var tmp = plugin.settings.position[i].replace(index, value);
                                    tmp != plugin.settings.position[i] && (0 === i ? plugin.dialog_left = eval(tmp) : plugin.dialog_top = eval(tmp))
                                }
                            })), (void 0 === plugin.dialog_left || void 0 === plugin.dialog_top) && (plugin.dialog_left = values.center, plugin.dialog_top = values.middle), plugin.settings.vcenter_short_message) {
                        var message = plugin.message.find("div:first"),
                            message_height = message.height(),
                            container_height = plugin.message.height();
                        container_height > message_height && message.css({
                            "padding-top": (container_height - message_height) / 2 + 6
                        })
                    }
                    "boolean" == typeof arguments[0] && arguments[0] === !1 || 0 === plugin.settings.reposition_speed ? plugin.dialog.css({
                        left: plugin.dialog_left,
                        top: plugin.dialog_top,
                        visibility: "visible",
                        opacity: 0
                    }).animate({
                            opacity: 1
                        },
                        plugin.settings.animation_speed_show) : (plugin.dialog.stop(!0), plugin.dialog.css("visibility", "visible").animate({
                            left: plugin.dialog_left,
                            top: plugin.dialog_top
                        },
                        plugin.settings.reposition_speed)),
                        plugin.dialog.find("a[class^=ZebraDialog_Button]:first").focus(),
                    plugin.isIE6 && setTimeout(emulate_fixed_position, 500)
                },
                emulate_fixed_position = function() {
                    var a = $(window).scrollTop(),
                        b = $(window).scrollLeft();
                    plugin.settings.modal && plugin.overlay.css({
                        top: a,
                        left: b
                    }),
                        plugin.dialog.css({
                            left: plugin.dialog_left + b,
                            top: plugin.dialog_top + a
                        })
                },
                get_buttons = function() {
                    if (plugin.settings.buttons !== !0 && !$.isArray(plugin.settings.buttons)) return ! 1;
                    if (plugin.settings.buttons === !0) switch (plugin.settings.type) {
                        case "question":
                            plugin.settings.buttons = ["Yes", "No"];
                            break;
                        default:
                            plugin.settings.buttons = ["Ok"]
                    }
                    return plugin.settings.buttons
                },
                get_type = function() {
                    switch (plugin.settings.type) {
                        case "confirmation":
                        case "error":
                        case "information":
                        case "question":
                        case "warning":
                            return plugin.settings.type.charAt(0).toUpperCase() + plugin.settings.type.slice(1).toLowerCase();
                        default:
                            return ! 1
                    }
                },
                browser = {
                    init: function() {
                        this.name = this.searchString(this.dataBrowser) || "",
                            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || ""
                    },
                    searchString: function(a) {
                        for (var b = 0; b < a.length; b++) {
                            var c = a[b].string,
                                d = a[b].prop;
                            if (this.versionSearchString = a[b].versionSearch || a[b].identity, c) {
                                if ( - 1 != c.indexOf(a[b].subString)) return a[b].identity
                            } else if (d) return a[b].identity
                        }
                    },
                    searchVersion: function(a) {
                        var b = a.indexOf(this.versionSearchString);
                        if ( - 1 != b) return parseFloat(a.substring(b + this.versionSearchString.length + 1))
                    },
                    dataBrowser: [{
                        string: navigator.userAgent,
                        subString: "MSIE",
                        identity: "explorer",
                        versionSearch: "MSIE"
                    }]
                };
            return browser.init(),
                plugin.init()
        }
    } (jQuery);