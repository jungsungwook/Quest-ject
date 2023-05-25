import { Router } from 'https://deno.land/x/oak/mod.ts';
import { JwtMiddleware } from '../middleware/jwtMiddleware.ts';
import { AuthSignUp } from './dto/auth-sign.ts';
import AuthService from './auth.service.ts';
import { GetDatabase } from '../utils/database.ts';
import { Client } from "https://deno.land/x/mysql/mod.ts";
const authService: AuthService = new AuthService();

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
        try {
            const body: AuthSignUp = await ctx.request.body().value;
            const client: Client = await GetDatabase();
            const result = await client.transaction(async (conn) => {
                const user = await authService.signUp(conn, body);
                console.log(user)
                return user;
            })
            ctx.response.body = {
                statusCode : 200,
                content : result
            };
            ctx.response.status = 200;
        } catch (e) {
            ctx.response.body = {
                statusCode : 500,
                content : e.message
            };
            ctx.response.status = 500;
        }
    })
    .get('/me', async (ctx) => {
        try {
            const client: Client = await GetDatabase();
            const result = await client.transaction(async (conn) => {
                const user = await authService.getUserByCustomId(conn, "jswcyber");
                return user;
            })
            ctx.response.body = {
                statusCode : 200,
                content : result
            };
            ctx.response.status = 200;
        } catch (e) {
            ctx.response.body = {
                statusCode : 500,
                content : e.message
            };
            ctx.response.status = 500;
        }
    })


