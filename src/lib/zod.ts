import {string, z} from "zod"

export const signUpSchema = z.object({
    email : z.string().email(),
    username : z.string().min(4).max(20),
    password : z.string().min(8).max(20)
})

export const signinSchema = z.object({
    email:z.string().email(),
    password:z.string()
})