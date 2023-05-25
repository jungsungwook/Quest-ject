import { Client, Connection } from "https://deno.land/x/mysql/mod.ts";
import { AuthSignUp } from "./dto/auth-sign.ts";
import { insert, select, tables } from "../utils/database.ts";
import UserRepository from "../models/user.ts";
const userRepository : UserRepository = new UserRepository();
export default class AuthService {

    async signUp(client: Connection, body: AuthSignUp) {
        const result = await userRepository.createUser(client, body);
        return result;
    }

    async getUserByCustomId(client: Connection, customId: string) {
        const result = await userRepository.getUser(client, customId);
        return result;
    }
}