import { GetDatabase } from "../utils/database.ts";
export const TABLENAME = "user";
export const TABLE = {
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

// Sequalize
const db = await GetDatabase();
await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        customId varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt datetime DEFAULT NULL,
        isDeleted tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);