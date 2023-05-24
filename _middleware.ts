import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { encoder } from "https://deno.land/x/djwt@v2.8/util.ts";
export async function handler(
    _req: Request,
    ctx: MiddlewareHandlerContext,
){
    try{
        const headers_authorization = _req.headers.get('Authorization');
        if(!headers_authorization) return new Response('Unauthorized', {status: 401});

        const token = headers_authorization.replace('Bearer ', '').replace('bearer ', '')
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(Deno.env.get("JWT_SECRET_KEY") as string),
            { name: "HMAC", hash: "SHA-512" },
            true,
            ["sign", "verify"],
        );
        const payload : any = await verify(token, key);
        const customId = payload.customId;
        ctx.state = {...ctx.state, customId : customId};
        return ctx.next();
    }catch(e){
        return ctx.next();
    }
    
}