import { Router } from 'https://deno.land/x/oak/mod.ts';
import { JwtMiddleware } from '../middleware/jwtMiddleware.ts';

export const AuthRouter = new Router();

AuthRouter.use(JwtMiddleware);

AuthRouter
    // .post('/signin', async (ctx) => {
    //     if(ctx.state.customId){
    //         return new Response(JSON.stringify({customId : ctx.state.customId}), {
    //             headers: {
    //                 "content-type": "application/json",
    //             },
    //             status: 200,
    //         });
    //     }
    //     const body = await _req.json();
    //     const { customId, password } = body;
        
    //     return new Response(JSON.stringify({}), {
    //         headers: {
    //             "content-type": "application/json",
    //         },
    //         status: 401,
    //     });
    // })
    .post('/signup', async (ctx) => {
        const body = await ctx.request.body().value;
        console.log(ctx.state)
        return new Response(JSON.stringify({}), {
            headers: {
                "content-type": "application/json",
            },
            status: 200,
        });
    })
    

