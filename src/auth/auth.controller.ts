import { Router } from 'https://deno.land/x/oak/mod.ts';

export const AuthRouter = new Router();

AuthRouter.use(async (ctx, next) => {
    await next();
    // 현재 시간
    const time = new Date();
    console.log(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

AuthRouter
    .post('/signin', async (_req, ctx) => {
        if(ctx.state.customId){
            return new Response(JSON.stringify({customId : ctx.state.customId}), {
                headers: {
                    "content-type": "application/json",
                },
                status: 200,
            });
        }
        const body = await _req.json();
        const { customId, password } = body;
        
        return new Response(JSON.stringify({}), {
            headers: {
                "content-type": "application/json",
            },
            status: 401,
        });
    })
    .post('/signup', async (ctx) => {
        ctx.response.body = 'Sign up';
    })
    

