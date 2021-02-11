import * as DataBaseT from './DatabaseType';


export interface System {
    cpu: Cpu,
    memory: number,
    Drives: Array<Drive>,
    platform: string,
    os: string,
    osversion: string,
    macaddr: string
}

export interface SystemUsage {
    cpu: number | null,
    memory: number | null
}


// DiskDrive
export interface Drive {
    name: string,
    size: number | null,
    freesize?: number,
    mount: string
}

// Processor
export interface Cpu {
    arch: 'arm' | 'arm64' | 'ia32' | 'mips' | 'mipsel' | 'ppc' | 'ppc64' | 's390' | 's390x' | 'x32' | 'x64' | string,
    coreCount: number,
    name: string
}


// Client Config

export interface ClientInfo {
    name: string,
    system: System,
    user: {
        name: string,
        passwd?: string,
        token?: string
    }
}

export interface ClientUsage {
    Drives?: Drive[];
    cpu: number | null;
    memory: number | null;
}


// NetWork Types
export interface ServerLoginNet {
    err?: "WRONG_DATA"
    ok?: boolean
}

export interface RegisterNet {
    err?: "WRONG_DATA" | "INVAILD_NAME_LENGTH" | "USER_EXISTS",
    name: string,
    token: string
}

export interface LoginNet {
    err?: "WRONG_DATA" | "LOGIN_FAILD",
    name: string,
    token: string
}

export interface GetServerNet {
    err?: "WRONG_DATA" | "NOT_FOUND",
    Server: DataBaseT.Server
}

export interface GetServersNet {
    err?: "WRONG_DATA" | "NOT_FOUND",
    Servers: Array<DataBaseT.Server>
}

// Database
export interface DBUser {
    name: string;
    passwd: string;
    token: string;
}

export interface DBServer extends System {
    name: string;
    usage: Array<DBServerUsage>;
    online: boolean;
}

export interface DBServerUsage extends ClientUsage{
    date: Date;
}

export interface DBAccount {
    name: string;
    passwd: string;
    token: string;
    Servers: Array<string>;
}