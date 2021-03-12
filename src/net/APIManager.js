import {Alert} from "react-native";
import md5 from "md5";
import axios from "axios";
import VersionNumber from "react-native-version-number";

const mockRequests = false;
const requestTimeout = 30 * 1000;   // milliseconds
const apiBaseUrl = getApiUrl();

axios.defaults.baseURL = apiBaseUrl;

// ######### //
//   Login   //
// ######### //

const loginUrl = "check_login/";

export function doLogin(user: string, pwd: string) {
    return new Promise((resolve, reject) => {
        if (mockRequests) {
            resolve({paramtest: "test"});
            return;
        }

        const data = new FormData();
        data.append("userName", user);
        data.append("userPwd", md5(pwd).toUpperCase());

        doGet(resolve, reject);
    });
}

// ################# //
//  General Helpers  //
// ################# //

function getApiUrl() {
    const appName = VersionNumber.bundleIdentifier;
    let apiUrl = "https://fakeql.com/rest/08cd2a4aac8f88a06afb2656a179fd6c";

    return apiUrl;
}

function handleResultCode(res: any, showAlert:boolean, resolve: Function, reject: Function) {
    const data = res.data;
    if (data && data.resultCode === 0) {
        resolve(data);
    } else if (data && data.resultCode > 0) {
        showAlertHelper(I18n.t("warning") + data.resultCode, data.resultMessage,showAlert);
        reject(data);
    } else {
        printRejection(data,showAlert);
        reject(res);
    }
}

function handleRejection(err: Object, showAlert:boolean, reject: Function) {
    if (err.response) {
        if (err.response.status === 504){
            showAlertHelper(I18n.t("error") + ": " + err.response.status, I18n.t("checkWifi"),showAlert);
        }
        else {
            showAlertHelper(I18n.t("error") + ": http " + err.response.status, I18n.t("errorServer"),showAlert);
        }
    } else if (err.request) {
        showAlertHelper(I18n.t("error"), I18n.t("errorConnection"),showAlert);
    } else {
        showAlertHelper(err.toString(), JSON.stringify(err.request._response),showAlert);
    }

    reject(err);
}

function printRejection(data: Object,showAlert:boolean) {
    let errCode;

    if (data.resultCode) {
        errCode = data.resultCode;
    } else {
        errCode = "";
    }

    showAlertHelper(I18n.t("error") + " "+ errCode, I18n.t("errorServer"),showAlert);
}

function doGet(path: string, showAlert:boolean, resolve: Function, reject: Function) {
    axios.get(path, {
            timeout: requestTimeout,
            transformResponse: transformAxiosResponse
        })
        .then((res) => handleResultCode(res, showAlert, resolve, reject))
        .catch((err) => handleRejection(err, showAlert, reject));
}
/*
function doPost(path: string, data: FormData, showAlert:boolean, resolve: Function, reject: Function) {
    axios.post(path, data, {
            timeout: requestTimeout,
            transformResponse: transformAxiosResponse
        })
        .then((res) => handleResultCode(res, showAlert, resolve, reject))
        .catch((err) => handleRejection(err, showAlert, reject));
}
*/


function transformAxiosResponse(data: any) {
    if (data instanceof Object) {
        return data;
    } else {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
}

function showAlertHelper(title:string, body:string,showAlert:boolean){
    if (showAlert) {
        Alert.alert(title, body,
                [{text: I18n.t("close"), style: "cancel"}],
                { cancelable: true }
            );
    }
}



