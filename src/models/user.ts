import { Connection } from "https://deno.land/x/mysql/mod.ts";
import { insert, select } from "../utils/database.ts";
import { Table } from "./dto/table.ts";
import { AuthSignUp } from "../auth/dto/auth-sign.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
export const TABLENAME = "user";
export const TABLE: Table = {
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
        default: '0',
        notNull: true,
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
        default: '0',
        notNull: true,
    },
}
export default class UserRepository {
    async createUser(client: Connection, body: AuthSignUp) {
        const { customId, name, email, password } = body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            customId,
            name,
            email,
            password: hashedPassword,
        }

        const result = await insert(client, TABLENAME, user);
        return result;
    }

    async getUser(client: Connection, customId: string) {
        const result = await select(client, TABLENAME, {
            "customId": customId,
            "isDeleted": 0,
        }, 1);
        return result;
    }

    async passwordCheck(client: Connection, customId: string, password: string) {
        const user = await this.getUser(client, customId);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        return isPasswordCorrect;
    }
}