import admin = require('firebase-admin');
import { Observable } from 'rxjs/Observable';

/**
 * WARNING: You must have the app initialized for the notifier to work.
 */
let decoratorApp = admin.app();
/**
 * Helper funcion, this function saves the error to the firebase error. The function expects firebase to be working ok.
 * If not the function will fail (Silently)
 * @param err The error that trigered the decorator
 * @param api_name The name of the api.
 * @param methodName The name of the method.
 * @param args args thrown by the error.
 */
function saveErrorToFirebase(err: any, api_name: string, methodName: string, args?: any[]): string | number {
    let timestamp = admin.database.ServerValue.TIMESTAMP;
    let error = {
        timestamp: timestamp,
        error: (err instanceof Error) ? { message: err.message, callstack: err.stack } : err,
        args: (!args.length) ? "no arguments" : args,
        methodName: methodName
    };
    let keyVal: string | number;
    let key: admin.database.ThenableReference;
    if (err.keyVal) {
        keyVal = err.keyVal;
        decoratorApp.database().ref(`api_errors/${api_name}` + keyVal).child('at').set(error, (error) => {
            /**
             * Maybe some logging here
             */
            if(error)
                console.log(error);
        });
        keyVal += `/at`;
    } else {
        key = decoratorApp.database().ref(`api_errors/${api_name}`).push(error, (error) => {
            /**
             * Maybe some logging here
             */
            if (error)
                console.log(error); 
        });
        keyVal = `/${key.key}`;
    }
    return keyVal;

}
/**
 * In case of some error, this function will modify the function to catch that error and send it to the Firebase database
 * @param api_name The name of the api to log the error
 */
export function errorNotifier(api_name: string) {
    return function (prot: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!prot[propertyKey]) {
            prot[propertyKey]();
        };
        const oldFuncVal = descriptor.value;
        descriptor.value = function (...args) {
            try {
                let retVal: Observable<any> | Promise<any> | any = oldFuncVal.apply(this, args);
                if (retVal) {
                    if (retVal instanceof Promise) {
                        retVal.catch((err) => {
                            auxErrorCatch(err, api_name, propertyKey, args);
                        });
                    } else if (retVal instanceof Observable) {
                        retVal.subscribe({
                            error: function (err) {
                                try{
                                    auxErrorCatch(err, api_name, propertyKey, args);
                                } catch(error) {}
                            }
                        });
                    }
                    return retVal;
                }
                return;
            } catch (error) {
                auxErrorCatch(error, api_name, propertyKey, args);
            }
        };
        return descriptor;
    }
}

function auxErrorCatch(err: any, api_name: string, propertyKey: string, args: any[]): never {
    let keyval: string | number;
    let newErr: Error | string | number = err;
    if (typeof err === "string" || typeof err === "number") {
        newErr = new Error(err + "");
    }
    keyval = saveErrorToFirebase(newErr, api_name, propertyKey, args);
    newErr["keyVal"] = keyval;
    throw newErr;
}
