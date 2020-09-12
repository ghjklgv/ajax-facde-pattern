import { IService } from '../iService';

export interface IServiceRunner {
    run: (service: IService) => void;
  
}

export interface IServiceRunnerPromise {
    runPromise: (service: IService) => Promise<any>;
}