export interface AuthenticatedUser {
    authenticated: boolean;
    cultureName?: string;
    displayName?: string;
    email?: string;
    enabled?: boolean;
    name?: string;
    roles: string[];
    username: string;
    verified?: boolean;
    exp?: Date;
    userId?: number;
    timeZoneId?: string;
    image: string;
    fullName: string;
    rights: UserRights;
    userRightsString: string;
    campuses: any[];
    businessUnit:string;
}
export interface UserRights {
    BusinessUnit: General;
    Region: General;
}
export interface General {
    Id: string;
    Text: string;
}