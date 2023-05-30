import { Router } from "https://deno.land/x/oak/mod.ts";
import apiRouter from "./api/api.routes.ts"
const router = new Router();

router.use("/api", apiRouter.routes(), apiRouter.allowedMethods());

export default router;