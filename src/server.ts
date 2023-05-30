import { Application } from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import router from "./routes.ts";
import { Connect } from "./utils/database.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { swaggerDoc } from "https://deno.land/x/deno_swagger_doc/mod.ts";

await Connect();
const app = new Application();

const swaggerDefinition = {
    info: {
        title: 'Quest-JECT API', // Title (required)
        version: '1.0.0', // Version (required)
    },
    host: `localhost:8000`, // Host (optional)
    basePath: '/', // Base path (optional)
};

const options = {
    swaggerDefinition,
    apis: ['./api/**/*.ts'],
};

const swagger = await swaggerDoc(options);

app.use(async (ctx, next) => {
    if (ctx.request.url.pathname === "/swagger.json") {
        ctx.response.body = swagger;
    } else {
        await next();
    }
});

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

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());


app.listen({ port: Deno.env.get("PORT") as unknown as number || 8000 });