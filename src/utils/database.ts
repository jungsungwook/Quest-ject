import { Client } from "https://deno.land/x/mysql/mod.ts";

let client: Client;

export const Connect = async () => {
    try {
        client = await new Client().connect({
            hostname: Deno.env.get("DATABASE_HOST") as string,
            username: Deno.env.get("DATABASE_USER") as string,
            db: Deno.env.get("DATABASE_NAME") as string,
            password: Deno.env.get("DATABASE_PASSWORD") as string,
            port: parseInt(Deno.env.get("DATABASE_PORT") as string),
        });
        console.log("Connected to database!");
    } catch (e) {
        console.log(e);
    }
}

export const GetDatabase = async () => {
    if (!client) await Connect();
    return client;
}
