import { Application } from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import router from "./routes.ts";
import { Connect } from "./utils/database.ts";

await Connect();
const app = new Application();

app.use(async (ctx, next) => {
    const responseHeaders = ctx.response.headers;
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, DELETE"
    );
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type");
    await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: Deno.env.get("PORT") as unknown as number || 8000 });