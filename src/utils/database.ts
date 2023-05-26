import { Client, Connection } from "https://deno.land/x/mysql/mod.ts";
import { Table } from "../models/dto/table.ts";
import { INSERTDATA } from "../models/dto/orm.ts";

let client: Client;
export let tables: { [key: string]: Table } = {};

export const Connect = async () => {
    try {
        console.log(Deno.env.get("DATABASE_HOST") as string)
        client = await new Client().connect({
            hostname: Deno.env.get("DATABASE_HOST") as string,
            username: Deno.env.get("DATABASE_USERNAME") as string,
            db: Deno.env.get("DATABASE_NAME") as string,
            password: Deno.env.get("DATABASE_PASSWORD") as string,
            port: parseInt(Deno.env.get("DATABASE_PORT") as string),
        });
        console.log("Connected to database!");

        tables = await GetTables();
        for (const tableName in tables) {
            await TableSync(tableName, tables[tableName]);
        }
        console.log("Synced tables!");
    } catch (e) {
        console.log(e);
    }
}

export const GetDatabase = async () => {
    if (!client) await Connect();
    return client;
}

/**
 * @description models 폴더에 있는 모든 테이블과 테이블 명을 조회
 */
export const GetTables = async () => {
    const tables: { [key: string]: Table } = {};
    const files = Deno.readDirSync("./src/models");
    for (const file of files) {
        if (file.isFile) {
            const module = await import(`../models/${file.name}`);
            const tableName = module.TABLENAME;
            tables[tableName] = module.TABLE;
        }
    }
    return tables;
}
/**
 * @description DB 테이블 생성. 테이블이 존재하지 않을 경우에만 생성
 * @param {string} tableName 테이블 이름
 * @param {Table} table 테이블 정보
 */
export const TableSync = async (tableName: string, table: Table) => {
    const db = await GetDatabase();
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${Object.keys(table).map((key) => {
        const column = table[key];
        let query = `${column.name} ${column.type}`;
        if (column.length) query += `(${column.length})`;
        if (column.notNull) query += ` NOT NULL`;
        if (column.autoIncrement) query += ` AUTO_INCREMENT`;
        if (column.default) query += ` DEFAULT ${column.default}`;
        if (column.primaryKey) query += ` PRIMARY KEY`;
        if (column.onUpdate) query += ` ON UPDATE ${column.onUpdate}`;
        return query;
    }).join(", ")})`;
    await db.execute(query);
}

export const select = async (client: Connection, table: Table|string, where?: { [key: string]: any }, limit?: number) => {
    const tablename = typeof table === "string" ? table : Object.keys(tables).find((key) => {
        return tables[key] === table;
    });
    const query = `SELECT * FROM ${tablename} ${where ? `WHERE ${Object.keys(where).map((key) => {
        if (typeof where[key] === "string") return `${key} = '${where[key]}'`;
        return `${key} = ${where[key]}`;
    }).join(" AND ")}` : ""} ${limit ? `LIMIT ${limit}` : ""}`;
    const query_result = await client.execute(query);
    if(!limit) return query_result.rows;
    else if(limit === 1) return query_result.rows![0];
}

export const insert = async (client: Connection, table: Table|string, data: INSERTDATA) => {
    const tablename = typeof table === "string" ? table : Object.keys(tables).find((key) => {
        return tables[key] === table;
    });
    const query = `INSERT INTO ${tablename} (${Object.keys(data).map((key) => {
        return key;
    }).join(", ")}) VALUES (${Object.keys(data).map((key) => {
        if (typeof data[key] === "string") return `'${data[key]}'`;
        return data[key];
    }).join(", ")})`;
    await client.execute(query); 
}

export const update = async (client: Connection, table: Table|string, data: INSERTDATA, where: { [key: string]: any }) => {
    const tablename = typeof table === "string" ? table : Object.keys(tables).find((key) => {
        return tables[key] === table;
    });
    const query = `UPDATE ${tablename} SET ${Object.keys(data).map((key) => {
        if (typeof data[key] === "string") return `${key} = '${data[key]}'`;
        return `${key} = ${data[key]}`;
    }).join(", ")} WHERE ${Object.keys(where).map((key) => {
        if (typeof where[key] === "string") return `${key} = '${where[key]}'`;
        return `${key} = ${where[key]}`;
    }).join(" AND ")}`;
    await client.execute(query); 
}