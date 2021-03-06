var logger = require('./logger');
var wot = require('./framework.js'); // launch the servers

logger.info("start demo application");

// define the things for the door, light and agent

wot.thing("agent12", {
    "@properties": {
        "door": { "type" : "thing", "uri" : "door12" },
        "light": { "type" : "thing", "uri" : "switch12" }
    }
}, {
    start: function(thing) {
        logger.info("  started " + thing._name);
        logger.info("  door is " + (thing.door.is_open ? "open" : "closed"));
        logger.info("  light is " + (thing.light.on ? "on" : "off"));
    },
    stop: function(thing) {},
});

wot.thing("door12", {
    "@events": {
        "bell": null,
        "key": {
            "valid": "boolean"
        }
    },
    "@properties": {
        "is_open": "boolean"
    },
    "@actions": {
        "unlock": null
    }
}, {
    start: function(thing) {
        thing.is_open = false;
    },
    stop: function(thing) {},
    unlock: function(thing) {
        logger.info("  unlocking" + thing._name);
    }
});

wot.thing("switch12", {
    "@properties": {
        "on": {
            "type": "boolean",
            "writeable": true
        }
    }
}, {
    start: function(thing) {
        thing.on = true;
    },
    stop: function(thing) {},
});

// test for resolving circular dependencies

wot.thing("foo1", {
    "@dependencies": {
        "bar": "bar1"
    }
}, {
    start: function(thing) {
        logger.info("  foo1's bar is " + thing.bar._name);
    },
    stop: function(thing) {},
});

wot.thing("bar1", {
    "@dependencies": {
        "foo": "foo1"
    }
}, {
    start: function(thing) {
        logger.info("  bar1's foo is " + thing.foo._name);
    },
    stop: function(thing) {},
});

wot.register_proxy("/wot/door12", function(thing) {
        logger.info('got proxy for door12');
    },
    function(err) {
        logger.error(err);
    });

wot.register_proxy("http://localhost:8888/wot/switch12", function(thing) {
    logger.info('got proxy for switch12');
    },
    function(err) {
        logger.error(err);
    });

wot.register_proxy("http://localhost:9999/wot/switch12", function(thing) {
        logger.info('got proxy for switch12');
    },
    function(err) {
        logger.error(err);
    });

wot.register_proxy("http://akira.w3.org:8888/wot/switch12", function(thing) {
        logger.info('got proxy for switch12');
    },
    function(err) {
        logger.error(err);
    });
