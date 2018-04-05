"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var Observable_1 = require("rxjs/Observable");
var decoratorApp = admin.app();
function sanitizeData(object, index, array) {
    var new_obj;
    if (typeof object === 'object' && !(object instanceof Array)) {
        new_obj = {};
        var new_key = void 0;
        for (var key in object) {
            if (key.includes('$')
                || key.includes('.')
                || key.includes('#')
                || key.includes('/')
                || key.includes('[')
                || key.includes(']')) {
                new_key = key.replace(/\$/g, '')
                    .replace(/\./g, '')
                    .replace(/\#/g, '')
                    .replace(/\//g, '')
                    .replace(/\[/g, '')
                    .replace(/\]/g, '');
            }
            else {
                new_key = key;
            }
            new_obj[new_key] = sanitizeData(object[key]);
        }
        return new_obj;
    }
    else if (typeof object === "undefined") {
        return object + "";
    }
    else {
        return object;
    }
}
function saveErrorToFirebase(err, api_name, methodName, args) {
    var timestamp = admin.database.ServerValue.TIMESTAMP;
    var error = {
        timestamp: timestamp,
        error: (err instanceof Error) ? { message: err.message, callstack: err.stack } : err,
        args: (!args.length) ? "no arguments" : args.map(sanitizeData),
        methodName: methodName
    };
    var keyVal;
    var key;
    if (err.keyVal) {
        keyVal = err.keyVal;
        decoratorApp.database().ref("api_errors/" + api_name + keyVal).child('at').setWithPriority(error, -(new Date().getTime()), function (error) {
            if (error)
                console.log(error);
        });
        keyVal += "/at";
    }
    else {
        key = decoratorApp.database().ref("api_errors/" + api_name).push(error, function (error) {
            if (error)
                console.log(error);
        });
        keyVal = "/" + key.key;
    }
    return keyVal;
}
function errorNotifier(api_name) {
    return function (prot, propertyKey, descriptor) {
        if (!prot[propertyKey]) {
            prot[propertyKey]();
        }
        ;
        var oldFuncVal = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                var retVal = oldFuncVal.apply(this, args);
                if (retVal) {
                    if (retVal instanceof Promise) {
                        retVal.catch(function (err) {
                            auxErrorCatch(err, api_name, propertyKey, args);
                        });
                    }
                    else if (retVal instanceof Observable_1.Observable) {
                        retVal.subscribe({
                            error: function (err) {
                                try {
                                    auxErrorCatch(err, api_name, propertyKey, args);
                                }
                                catch (error) { }
                            }
                        });
                    }
                    return retVal;
                }
                return;
            }
            catch (error) {
                auxErrorCatch(error, api_name, propertyKey, args);
            }
        };
        return descriptor;
    };
}
exports.errorNotifier = errorNotifier;
function auxErrorCatch(err, api_name, propertyKey, args) {
    var keyval;
    var newErr = err;
    if (typeof err === "string" || typeof err === "number") {
        newErr = new Error(err + "");
    }
    keyval = saveErrorToFirebase(newErr, api_name, propertyKey, args);
    newErr["keyVal"] = keyval;
    throw newErr;
}
