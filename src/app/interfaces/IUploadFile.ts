export interface IUploadFile {
    accept: string;
    size: string;
    maxFiles: number;
    multiple: boolean;
    files: string;
    disableActions: boolean;
    label?: string
}
