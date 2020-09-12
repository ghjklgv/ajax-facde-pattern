export interface IService {
   /* properties*/
   url:  string;
   token: string;
   getTimeoutMs: () => number;
   getContentType: () => string;
   getBody: () => {};
   getMethod: () => string;
   onRequestResult: (response: any) => void;
   onRequestFail: (response: any) => void;
   getHeaders: () => {};
}
