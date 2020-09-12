export interface IWebServiceListener {
    onRequestSuccess: (entity: any) => void;
    onRequestFail: (code: number) => void;
}
