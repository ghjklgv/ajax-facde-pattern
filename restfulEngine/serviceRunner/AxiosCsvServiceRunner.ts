import axios from 'axios';
import {
    IServiceRunner
} from './iServiceRunner';
import {
    IService
} from '../iService';
require('dotenv').config()

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
export class AxiosCsvServiceRunner implements IServiceRunner {
    constructor() {}

    run(service: IService) {
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
            // console.log(response);
            if (response.status === 401) {
                history.push('/');
                console.log("Have to clean credential info & redirect to login page.");
            } else if (response.status === 200) {
                // console.log("Success");
            }
            return response;
        }, function (error) {
            if (error.response.status === 401) {
                history.push("/");
                // alert(error.response.responseMsg)
                // console.log("Have to clean credential info & redirect to login page.");
              } else if (error.status === 200) {
              }
            return Promise.reject(error);
        });

        /* Start request */
        instance.request({
            baseURL: config['baseURL'],
            method: service.getMethod(),
            timeout: service.getTimeoutMs(),
            headers: config['headers'],
            data: service.getBody()
        }).then(function (response) {
            service.onRequestResult(response);
        }).catch(function (error) {
            service.onRequestFail(error.response);
        }).then(function () {
            // always executed
        });
    }
}