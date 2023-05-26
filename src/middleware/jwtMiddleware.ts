import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { encoder } from "https://deno.land/x/djwt@v2.8/util.ts";
import { Middleware } from "https://deno.land/x/oak/mod.ts";

export const JwtMiddleware : Middleware = async (ctx, next) => {
    try{
        const headers_authorization = ctx.request.headers.get('Authorization');
        if(!headers_authorization) throw new Error("Authorization Header Not Found");
        const token = headers_authorization.replace('Bearer ', '').replace('bearer ', '')
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(Deno.env.get("JWT_SECRET_KEY") as string),
            { name: "HMAC", hash: "SHA-512" },
            true,
            ["sign", "verify"],
        );
        const payload = await verify(token, key);
        const customId = payload.customId;
        ctx.state = {...ctx.state, customId : customId};
        return next();
    }catch(e){
        return next();
    }
}