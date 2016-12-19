declare module "rdconfig" {
    import {IConfig} from "config";

    interface RDConfig {
        encrypt(value: string): string;
        db(): Object;
        get(key: string): string|Object;
        has(key: string): boolean;
        getConfigObj(): IConfig;
    }
    const rdconfig: RDConfig;
    export = rdconfig;
}
