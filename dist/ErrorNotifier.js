"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var Observable_1 = require("rxjs/Observable");
function saveErrorToFirebase(err, api_name, methodName, args) {
    var timestamp = new Date().getTime();
    var error = {
        timestamp: timestamp,
        error: (err instanceof Error) ? { message: err.message, callstack: err.stack } : err,
        args: (!args.length) ? "no arguments" : args,
        methodName: methodName,
        '.priority': -(timestamp)
    };
    admin.database().ref("api_errors/" + api_name).push(error)
        .catch(function (error) {
        console.log(error);
    });
}
function errorNotifier(api_name) {
    return function (prot, propertyKey, descriptor) {
        if (!prot[propertyKey]) {
            prot[propertyKey]();
        }
        ;
        prot['container_' + propertyKey] = prot[propertyKey];
        prot[propertyKey] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                var fun = prot['container_' + propertyKey];
                var retVal = fun.apply(void 0, args);
                if (retVal) {
                    if (retVal instanceof Promise) {
                        retVal.catch(function (err) {
                            saveErrorToFirebase(err, api_name, propertyKey, args);
                            throw err;
                        });
                    }
                    else if (retVal instanceof Observable_1.Observable) {
                        retVal.subscribe({ error: function (err) {
                                console.log(err);
                                saveErrorToFirebase(err, api_name, propertyKey, args);
                            } });
                    }
                    return retVal;
                }
                return;
            }
            catch (error) {
                saveErrorToFirebase(error, api_name, propertyKey, args);
                throw error;
            }
        };
    };
}
exports.errorNotifier = errorNotifier;
