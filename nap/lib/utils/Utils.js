"use strict";

var assert = require("chai").assert;

var clc = require("cli-color");
var _ = require('lodash-node');
var AppConfig = require("../../config/AppConfig");
var MDNlinks = require('../../data/seed/bonfireMDNlinks');

var TextLib = require("./TextLib.js");

// var winston = require("winston");

// var Logger = require("./Logger.js");


// console.log("AppConfig required", AppConfig);

// check if we're in test mode
// console.log("Utils", "argv", process.argv);


var LOG_LEVEL_ERROR = 2,
    LOG_LEVEL_WARN = 3,
    LOG_LEVEL_INFO = 5;

var Utils = {

    cols: {
        // error: clc.red.bold,
        error: clc.bgRedBright.white.bold,
        warn: clc.black.bgYellow.bold,
        info: clc.black.cyanBright,
        info2: clc.black.bgCyan,
        notice: clc.blue,
        bright: clc.xterm(237).bgXterm(195),
        dimmed: clc.xterm(232).bgXterm(253),
        warning: clc.xterm(232).bgXterm(215),
        errorColors: clc.xterm(232).bgRedBright,
    },

    logLevel: 10,  // default

    // this can't run strict
    // cls: function () {
    //     process.stdout.write('\033c');  // cls
    // },

    log: function(msg, obj) {
        if (this.logLevel > LOG_LEVEL_INFO) {
            var where = this.stackLines(3, 4);
        } else {
            var where = "";
        }
        Utils.clog(where, msg, obj);
    },

    clog: function (where, msg, obj) {
        if (this.logLevel < LOG_LEVEL_INFO) {
            return;
        }
        obj = obj || "";
        //msg = ">" + msg;
        //console.log( );
        console.log(this.cols.info(where), this.cols.info(msg), obj);
        // winston.log(where, msg, obj);
    },

    // log during test
    tlog: function () {
        // p1 = p1 || "";
        // p2 = p2 || "";
        // p3 = p3 || "";
        var args = Array.prototype.slice.call(arguments);

        // Array.prototype.push.apply( args, arguments );
        var p1 = args.shift() || "_";
        var p2 = args.shift() || "_";
        var p3 = args.shift() || "_";
        var line = this.stackLines(3, 4);
        //console.log('------' + line);
        console.log(this.cols.bright(p1), p2, p3);
        args.forEach(function(p) {
            if (p) {console.log(p); }
        });
    },

    warn: function (where, msg, obj) {
        if (this.logLevel < LOG_LEVEL_WARN) {
            // console.log("skipping warn this.logLevel", this.logLevel);
            return;
        }
        obj = obj || "";
        console.warn(this.cols.warn(where), this.cols.warn(msg), obj);
    },

    stackTrace: function() {
        var err = new Error();
        console.log(err);
        return err.stack;
    },

    stackLines: function(from, to) {
        var err = new Error();
        // console.log(err);
        var lines = err.stack.split('\n');
        return lines.slice(from, to).join('\n');
    },

    error: function (where, msg, obj) {
        if (this.logLevel < LOG_LEVEL_ERROR) {
            return;
        }
        obj = obj || "";
        // var callerName = arguments.callee.caller ? arguments.callee.caller.name : "global";
        console.error(this.cols.error(where), this.cols.error(msg), obj);

        var stackLines = this.stackLines(3, 10);
        where = "ERROR: " + stackLines + "\n / " + where;
        console.log(stackLines);
    },

    // move to TextLib
    // does ~same as dashedName() method so remove this one
    sanitize: function (str, opts) {
        if (opts && opts.spaces) {
            str = str.replace(/\s/g, "-");
        }
        str = str.toLowerCase();
        str = str.replace(".md", "");
        // \?   leave Q marks
        str = str.replace(/([^a-z0-9áéíóúñü_@\-\s]|[\t\n\f\r\v\0])/gim, "");
        return str;
    },

    // display filenames replace the - with a space
    namify: function (str, opts) {
        str = str.replace(/-/g, " ");
        return str;
    },

    asFileName: function (str) {
        if (str) {
            str = str.replace(/ /g, "-");
        }
        str = str.toLowerCase();
        return str;
    },

    // text is optional if we want URL to be different from displayed text
    linkify: function (path, where, text) {
        var host, link, uri, name;

        where = where || "wiki";
        text = text || path;
        if (!path) {
        	Utils.error("tried to linkify an empty item");
        	return "-----";
        }
        path = path.replace("?", "%3F");  // not URL encoded

        switch (where) {
            case 'gitter':
            case 'camperbot':
                host = AppConfig.gitterHost + AppConfig.getBotName() + "/";
                break;

            case 'wiki':
                host = AppConfig.wikiHost;
                break;
        }

        uri = host + path;
        name = Utils.namify(text);
        link = "[" + name + "](" + uri + ")";
        // console.log("Utils.linkify args>", path, where, text);
        Utils.clog("Utils.linkify>", "link", link);
        return link;
    },

    splitParams: function (text) {
        assert.isString(text);
        var keyword, parts, params;

        parts = text.split(" ");
        keyword = parts.shift();
        if (parts.length > 0) {
            params = parts.join(" ");
        }
        var res = {
            keyword: keyword,
            params: params
        };
        return res;
    },

    checkNotNull: function (item, msg) {
        if (item) {
            return true; // means OK
        } else {
            Utils.error(msg);
            return false;
        }
    },

    isObject: function (obj, errmsg) {
        errmsg = errmsg || "not an object";
        return true;

        if (typeof obj === Object) {
            return true; // means OK
        } else {
            this.error(errmsg, obj);
            return false;
        }
    },


    makeMdnLinks: function(items) {
        var out = "";
        if (!items) {
            Utils.error("tried to makeMdnLinks for no items");
            return "";
        }
        items.map(function(one) {
            out += "\n- [" + one + "](" + MDNlinks[one] + ")";
        });
        return out;
    },

    timeStamp: function(when, baseDate) {
        var d1, timestamp, month, day;
        baseDate = baseDate || new Date();
        d1 = new Date();

        switch(when) {
            case 'yesterday':
            default:
                d1.setDate(baseDate.getDate() - 1);
        }

        month = (d1.getMonth() + 1);
        month = _.padLeft(month, 2, '0');

        day = (d1.getDate());
        day = _.padLeft(day, 2, '0');

        timestamp = d1.getFullYear() + '/' + month + '/' + day;
        return timestamp;

    },

    hasProperty: function(obj, prop, msg) {
        if (obj && obj.hasOwnProperty(prop)) {
            return true;
        }
        msg = msg || "ERROR";
        Utils.error(msg);
        Utils.error("missing property", prop, obj);
        return false;
    },

    betaFooter: function() {
        var footer = "\n\n >this feature is linked to our [beta site](beta.freecodecamp.com), so it may not have all users til we go live with the new release. ";
        footer += "Also check that FCC ID matches githubID!";
        return footer;
    }


    // checkPrototype: function(obj, expected) {
    //     Utils.clog("Utils.checkPrototype", obj, expected);
    //     console.log("proto", obj.prototype);
    // }


};

//function clog() {
//    Utils.clog.call("Utils", arguments);
//}

Utils.logLevel = parseInt(process.env.LOG_LEVEL || 4);

// var logFile = __dirname + '/../../log/winston.log';
// var logFile = "winston.log";
// winston.add(winston.transports.File, { filename: logFile });

// console.log("winston logs:", logFile);
// var logger = new winston.Logger();
// logger.log('info', 'Hello distributed log files!');
// winston.log("hello", "winston startup");


module.exports = Utils;
