import { Router } from "https://deno.land/x/oak/mod.ts";
import { AuthRouter } from "./auth/auth.controller.ts";

const apiRouter = new Router();
apiRouter.use("/auth", AuthRouter.routes(), AuthRouter.allowedMethods());

export default apiRouter;

