import { Table } from "./dto/table.ts";

export const TABLENAME = "quest"
export const TABLE: Table = {
    id: {
        name: "id",
        type: "int",
        length: 11,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
    },
    title: {
        name: "title",
        type: "varchar",
        length: 255,
        notNull: true,
    },
    contents: {
        name: "contents",
        type: "varchar",
        length: 2000,
    },
    createdBy: {
        name: "createdBy",
        type: "varchar",
        length: 255,
        notNull: true,
    },
    createdAt: {
        name: "createdAt",
        type: "datetime",
        notNull: true,
        default: "CURRENT_TIMESTAMP",
    },
    updatedAt: {
        name: "updatedAt",
        type: "datetime",
        notNull: true,
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    },
    deletedAt: {
        name: "deletedAt",
        type: "datetime",
    },
    isDeleted: {
        name: "isDeleted",
        type: "tinyint",
        length: 4,
        default: '0',
        notNull: true,
    },
}

