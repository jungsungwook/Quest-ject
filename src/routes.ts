import { Router } from "https://deno.land/x/oak/mod.ts";
import apiRouter from "./api/api.routes.ts"
import pageRouter from "./pages/pages.routes.ts";
const router = new Router();

router.use("/", pageRouter.routes(), pageRouter.allowedMethods());

router.use("/api", apiRouter.routes(), apiRouter.allowedMethods());

export default router;