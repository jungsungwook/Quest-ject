import { GetDatabase } from "../utils/database.ts";
import { Table } from "./dto/table.ts";
export const TABLENAME = "user";
export const TABLE : Table = {
    id: {
        name: "id",
        type: "int",
        length: 11,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
    },
    customId: {
        name: "customId",
        type: "varchar",
        length: 255,
        notNull: true,
    },
    name: {
        name: "name",
        type: "varchar",
        length: 255,
        notNull: true,
    },
    email: {
        name: "email",
        type: "varchar",
        length: 255,
        notNull: true,
    },
    password: {
        name: "password",
        type: "varchar",
        length: 255,
        notNull: true,
    },
    role: {
        name: "role",
        type: "int",
        length: 11,
        default: 0,
    },
    refreshToken: {
        name: "refreshToken",
        type: "varchar",
        length: 255,
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
        default: 0,
    },
}