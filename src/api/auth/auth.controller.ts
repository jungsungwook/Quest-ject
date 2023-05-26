import { Router } from 'https://deno.land/x/oak/mod.ts';
import { JwtMiddleware } from '../../middleware/jwtMiddleware.ts'
import { AuthSignUp } from './dto/auth-sign.ts';
import AuthService from './auth.service.ts';
import { GetDatabase } from '../../utils/database.ts';
import { Client } from "https://deno.land/x/mysql/mod.ts";
const authService: AuthService = new AuthService();

export const AuthRouter = new Router();
AuthRouter.use(JwtMiddleware);
AuthRouter
    .post('/signin', async (ctx) => {
        try{
            if(ctx.state.customId){
                const client: Client = await GetDatabase();
                const result = await client.transaction(async (conn) => {
                    const user = await authService.signInByAccessToken(conn, ctx.state.customId);
                    return user;
                });
                ctx.response.body = {
                    statusCode : 200,
                    content : result
                };
                ctx.response.status = 200;
                return;
            }
            const body: AuthSignUp = await ctx.request.body().value;
            const client: Client = await GetDatabase();
            const result = await client.transaction(async (conn) => {
                const user = await authService.signIn(conn, body);
                return user;
            })
            ctx.response.body = {
                statusCode : 200,
                content : result
            };
            ctx.response.status = 200;
        }catch (e){
            if(e.status === undefined) e.status = 500;
            ctx.response.body = {
                statusCode : e.status,
                content : e.message
            };
            ctx.response.status = e.status;
        }
    })
    .post('/signup', async (ctx) => {
        try {
            const body: AuthSignUp = await ctx.request.body().value;
            const client: Client = await GetDatabase();
            const result = await client.transaction(async (conn) => {
                const user = await authService.signUp(conn, body);
                return user;
            })
            ctx.response.body = {
                statusCode : 200,
                content : result
            };
            ctx.response.status = 200;
        } catch (e) {
            if(e.status === undefined) e.status = 500;
            ctx.response.body = {
                statusCode : e.status,
                content : e.message
            };
            ctx.response.status = e.status;
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


