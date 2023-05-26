import { Router } from "https://deno.land/x/oak/mod.ts";

const pageRouter = new Router();

pageRouter.use("/home", async (ctx) => {
    console.log("pageRouter");
    await ctx.send({
        root: `${Deno.cwd()}/src/pages`,
        index: "index.html",
    });
});

export default pageRouter;