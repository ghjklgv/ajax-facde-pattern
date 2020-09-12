import { IServiceRunner ,IServiceRunnerPromise} from './serviceRunner/iServiceRunner';
import { IService } from './iService';
import { AxiosServiceRunner } from './serviceRunner/axiosServiceRunner';
import { AxiosCsvServiceRunner } from './serviceRunner/AxiosCsvServiceRunner';
import { AxiosPromiseRunner } from './serviceRunner/AxiosPromiseRunner';


export class ServiceEngine {
  runner: IServiceRunner;
  csvRunner: IServiceRunner;
  promiseRunner: IServiceRunnerPromise;
  constructor() {
     this.runner = new AxiosServiceRunner();
     this.csvRunner = new AxiosCsvServiceRunner();
     this.promiseRunner = new AxiosPromiseRunner();
  }
  
  promiseRequest(service: IService) :Promise<any>{
    if (service != null) 
    var _this = this
    return new Promise(function (resolve, reject) {
      _this.promiseRunner.runPromise(service).then((response:any)=>{
        resolve(response.data)
      }) });
  }
  request(service: IService) {
     if (service != null) this.runner.run(service);
  }
  requestCSV(service: IService) {
     if (service != null) this.csvRunner.run(service);
  }
}

