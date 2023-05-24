export interface Table {
    [key: string]: {
        name: string;
        type: string;
        length?: number;
        primaryKey?: boolean;
        autoIncrement?: boolean;
        notNull?: boolean;
        default?: any;
        onUpdate?: string;
    };
}