import { Router } from "https://deno.land/x/oak/mod.ts";
import Home from "./home/home.tsx";
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.14.0/server";

const pageRouter = new Router();

pageRouter.get("/home", async (ctx) => {
    console.log("pageRouter");
});

function render(jsx: any){
    return ReactDOMServer.renderToString(jsx());
}

export default pageRouter;