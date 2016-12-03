declare module "rdconfig" {
    import config = require("config");

    interface RDConfig {
        encrypt(value: string): string;
        db(): Object;
        get(key: string): string|Object;
        has(key: string): boolean;
        getConfigObj(): config;
    }
    const rdconfig: RDConfig;
    export = rdconfig;
}
