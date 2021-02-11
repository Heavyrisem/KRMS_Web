import { ClientUsage, Drive, System } from "./Types";

export interface User {
    name: string;
    passwd: string;
    token: string;
}

export interface Server extends System {
    name: string;
    usage: Array<ServerUsage>;
    online: boolean;
}

export interface ServerUsage extends ClientUsage{
    date: Date;
}

export interface Account {
    name: string;
    passwd: string;
    token: string;
    Servers: Array<string>;
}