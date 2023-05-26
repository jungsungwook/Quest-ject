import { Client, Connection } from "https://deno.land/x/mysql/mod.ts";
import { AuthSignIn, AuthSignUp } from "./dto/auth-sign.ts";
import { insert, select, tables } from "../../utils/database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import UserRepository from "../../models/user.ts";
import { encoder } from "https://deno.land/x/djwt@v2.8/util.ts";
import { createHttpError } from "https://deno.land/std@0.170.0/http/http_errors.ts";
import { type ErrorStatus } from "https://deno.land/std@0.170.0/http/http_status.ts";

const userRepository: UserRepository = new UserRepository();
export default class AuthService {

    async signUp(client: Connection, body: AuthSignUp) {
        const idCheck = await userRepository.getUserByCustomId(client, body.customId);
        if (idCheck) {
            throw createHttpError(401, "이미 존재하는 아이디입니다.");
        }
        const emailCheck = await userRepository.getUserByEmail(client, body.email);
        if (emailCheck) {
            throw createHttpError(401, "이미 존재하는 이메일입니다.");
        }

        const result = await userRepository.createUser(client, body);
        return result;
    }

    async signIn(client: Connection, body: AuthSignIn) {
        const user = await userRepository.getUserByCustomId(client, body.customId);
        if (user && await bcrypt.compare(body.password, user.password)) {
            const acesspayload = {
                customId: user.customId,
                name: user.name,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + (Deno.env.get("JWT_ACCESS_TOKEN_EXPIRES") as unknown as number | 60 * 60 * 12),
            };
            const refreshpayload = {
                customId: user.customId,
                exp: Math.floor(Date.now() / 1000) + (Deno.env.get("JWT_REFRESH_TOKEN_EXPIRES") as unknown as number | 60 * 60 * 24 * 7),
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
                ["sign", "verify"],
            );
            const accessToken = await create({ alg: "HS512", typ: "JWT" }, acesspayload, acesskey);
            const refreshToken = await create({ alg: "HS512", typ: "JWT" }, refreshpayload, refreshkey);
            await this.setUserRefreshToken(client, user.customId, refreshToken);
            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
        } else {
            throw createHttpError(401, "아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    async getUserByCustomId(client: Connection, customId: string) {
        const result = await userRepository.getUserByCustomId(client, customId);
        return result;
    }

    async getUserByEmail(client: Connection, email: string) {
        const result = await userRepository.getUserByEmail(client, email);
        return result;
    }

    async setUserRefreshToken(client: Connection, customId: string, refreshToken: string) {
        const result = await userRepository.setUserRefreshToken(client, customId, refreshToken);
        return result;
    }

    async signInByAccessToken(client: Connection, customId: string) {
        const user = await userRepository.getUserByCustomId(client, customId);
        if (user) {
            const acesspayload = {
                customId: user.customId,
                name: user.name,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + (Deno.env.get("JWT_ACCESS_TOKEN_EXPIRES") as unknown as number | 60 * 60 * 12),
            };
            const refreshpayload = {
                customId: user.customId,
                exp: Math.floor(Date.now() / 1000) + (Deno.env.get("JWT_REFRESH_TOKEN_EXPIRES") as unknown as number | 60 * 60 * 24 * 7),
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
                ["sign", "verify"],
            );
            const accessToken = await create({ alg: "HS512", typ: "JWT" }, acesspayload, acesskey);
            const refreshToken = await create({ alg: "HS512", typ: "JWT" }, refreshpayload, refreshkey);
            await this.setUserRefreshToken(client, user.customId, refreshToken);
            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
        }else {
            throw createHttpError(401, "잘못된 접근입니다.");
        }
    }
}