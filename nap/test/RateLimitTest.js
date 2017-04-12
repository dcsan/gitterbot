"use strict";

// run this one test with:
// bin/test.sh test/RateLimitTest.js


require('dotenv').config({path: 'dot.env'});

var assert = require("chai").assert,
    expect = require("chai").expect;

var GBot = require("../lib/bot/GBot.js"),
    Utils = require("../lib/utils/Utils"),
    TestHelper = require("./TestHelper"),
    KBase = require("../lib/bot/KBase.js");


describe("RateLimit", function () {

    it("should not allow spamming", function() {
        var message = TestHelper.makeMessageFromString("spamtest");
        var res1 = GBot.overRateLimit(message);
        var res2 = GBot.overRateLimit(message);

        expect(res1).to.equal(false);
        expect(res2).to.equal(true, "spam on second message not detected");
    });

});

