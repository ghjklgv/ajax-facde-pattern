import axios from 'axios';
import {
    IServiceRunnerPromise
} from './iServiceRunner';
import {
    IService
} from '../iService';
import { notification } from "antd";

require('dotenv').config()

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
export class AxiosPromiseRunner implements IServiceRunnerPromise {
    constructor() {}

    runPromise(service: IService) : Promise<any>{
        const config = {};
        config['headers'] = service.getHeaders();
        config['headers']['Content-Type'] = service.getContentType();
        const instance = axios.create();
        /* Add Interceptor */
        // Add a request interceptor
        let session = sessionStorage.getItem('userJWT');
        instance.interceptors.request.use(function (config) {
            if(sessionStorage.userJWT){
                config.headers.Authorization = "Bearer " + session;
                config.url = process.env.REACT_APP_API_HOST + service.url;
            }else {
                config.url = process.env.REACT_APP_API_HOST + service.url;
            }
            // Do something before request is sent
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });

        // Add a response interceptor
        instance.interceptors.response.use(function (response) {
            if (response.status === 401) {
                history.push('/');
                console.log("Have to clean credential info & redirect to login page.");
            } else if (response.status === 200) {
            }
            return response;
        }, function (error) {
            if (error.response.status === 401) {
                history.push("/");
              
              } else if (error.status === 200) {
              
            }
           
            return Promise.reject(error);
        });
        return new Promise(function (resolve, reject) {
            instance.request({
                baseURL: config['baseURL'],
                method: service.getMethod(),
                timeout: service.getTimeoutMs(),
                headers: config['headers'],
                data: service.getBody()
            }).then(function (response) {

                if (
                    // response.data.recordCount == undefined ||
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "search" &&
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "alllist" &&
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "list"&&
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "procStatusList"&&
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "validlist"&&
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "userList"&&
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "getCreateData"&&
                    response.request.responseURL.split("/")[
                      response.request.responseURL.split("/").length - 1
                    ] != "searchByStatus"
                  ) {
                    notification["success"]({
                      message:
                        "" + response.data.retMsg == undefined ||
                        response.data.retMsg == ""
                          ? "Success"
                          : response.data.retMsg,
                      description: ""
                    });
                  }

                resolve(response);
            }).catch(function (error) {
                if(error.response.status==400){
                    notification["error"]({
                        message:
                         'Sorry,an unknown error occured. Please try again.',
                        description: ""
                      });
                }else if(error.response.status==500){
                    notification["error"]({
                        message:
                         'Sorry,an unknown error occured. Please try again.',
                        description: ""
                      });
                }
                reject(error.response.status)
                // service.onRequestFail(error.response);
            })
        });
        /* Start request */
       
    }
}