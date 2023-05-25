import { Client, Connection } from "https://deno.land/x/mysql/mod.ts";
import { AuthSignIn, AuthSignUp } from "./dto/auth-sign.ts";
import { insert, select, tables } from "../utils/database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import UserRepository from "../models/user.ts";
import { encoder } from "https://deno.land/x/djwt@v2.8/util.ts";
const userRepository : UserRepository = new UserRepository();
export default class AuthService {

    async signUp(client: Connection, body: AuthSignUp) {
        const result = await userRepository.createUser(client, body);
        return result;
    }

    async signIn(client: Connection, body: AuthSignIn) {
        const user = await userRepository.getUser(client, body.customId);
        if( user && await bcrypt.compare(body.password, user.password)){
            const payload = {
                customId : user.customId,
                name : user.name,
                email : user.email,
                role : user.role
            };
            const acesskey = await crypto.subtle.importKey(
                "raw",
                encoder.encode(Deno.env.get("JWT_SECRET_KEY") as string),
                { name: "HMAC", hash: "SHA-512" },
                true,
                ["sign", "verify"],
            );
            const refreshkey = await crypto.subtle.importKey(
                "raw",
                encoder.encode(Deno.env.get("JWT_REFRESH_KEY") as string),
                { name: "HMAC", hash: "SHA-512" },
                true,
                ["verify"],
            );
            const accessToken = await create({ alg: "HS512", typ: "JWT" }, payload, acesskey);
            const refreshToken = await create({ alg: "HS512", typ: "JWT" }, payload, refreshkey);
            
            return {
                accessToken : accessToken,
                refreshToken : refreshToken
            };
        }
        return {};
    }

    async getUserByCustomId(client: Connection, customId: string) {
        const result = await userRepository.getUser(client, customId);
        return result;
    }
}