import admin = require('firebase-admin');
import {Observable} from 'rxjs/Observable';

/**
 * Helper funcion, this function saves the error to the firebase error.
 * @param err The error that trigered the decorator
 * @param api_name The name of the api.
 * @param methodName The name of the method that triggered the error
 * @param args Arguments returned by the error
 */
function saveErrorToFirebase(err: any, api_name: string, methodName: string, args?: any[]): void {
    let timestamp = new Date().getTime();
    let error = {
        timestamp: timestamp, 
        error: (err instanceof Error) ? {message: err.message, callstack: err.stack} : err,
        args: (!args.length) ? "no arguments" : args,
        methodName: methodName,
        '.priority': -(timestamp) // Sort Descending by date
    };
    admin.database().ref(`api_errors/${api_name}`).push(error)
        .catch((error) => {
            /**
             * Maybe some logging here
             */
            console.log(error);
        });
}

/**
 * In case of some error, this function will modify the function to catch that error and send it to the Firebase database
 * @param api_name The name of the api to log the error
 */
export function errorNotifier(api_name: string) {
    return function (prot: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if(!prot[propertyKey]){
            prot[propertyKey]();
        };
        prot['container_'+propertyKey] = prot[propertyKey];
        prot[propertyKey] = function (... args) {
            try {
                let fun = prot['container_'+propertyKey];
                let retVal: Observable<any> | Promise<any> | any = fun(... args);
                if(retVal) {
                    if (retVal instanceof Promise){
                        retVal.catch((err) => {
                            saveErrorToFirebase(err,api_name,propertyKey,args);
                            throw err;
                        });
                    }else if (retVal instanceof Observable) {
                        retVal.subscribe({ error: function (err)  {
                            console.log(err);
                            saveErrorToFirebase(err,api_name,propertyKey,args);
                        }});
                    }
                    return retVal;
                }
                return;
            } catch (error) {
                saveErrorToFirebase(error,api_name,propertyKey,args);
                throw error;
            }
        }
    }
}