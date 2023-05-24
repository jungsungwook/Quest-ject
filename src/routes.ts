import { Router } from "https://deno.land/x/oak/mod.ts";
import { AuthRouter } from "./auth/auth.controller.ts";

const router = new Router();
// middleware
router.use("/auth", AuthRouter.routes(), AuthRouter.allowedMethods());

export default router;