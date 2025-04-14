import express from "express"
import jwt from "jsonwebtoken"
import {createUserSchema, signinSchema} from "@repo/common/types"
import { middleware } from "./middleware"
import {prismaClient} from "@repo/db/client"
import {JWT_SECRET} from "@repo/backend-common/config"
import bcrypt from "bcryptjs";
const app = express()

app.use(express.json())


app.post("/signup", async (req, res) => {
    try {
        const parsedData = createUserSchema.safeParse(req.body);
    if(!parsedData.success) {

        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
    const existingUser = await prismaClient.user.findUnique({where: {email: parsedData.data.username}});
    if(existingUser) {
        res.status(400).json({
            message: "User already exits"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedData.data.password, salt);
    const user= await prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            name: parsedData.data.name,
            password: hashedPassword
        }

    })
    res.json({
        message: "User Created",
        userId: user.id
    })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.post("/signin", async (req, res) => {

    try {
        const parsedData = signinSchema.safeParse(req.body);
        if(!parsedData.success) {

            res.status(400).json({
                message: "Incorrect Credentials"
            })
            return
        }

        const user = await prismaClient.user.findUnique({
            where: {
                email: parsedData.data?.username
            }
        })

        if(!user) {
            res.status(403).json({
                message: "Wrong credentials"
            })
            return
        }

        const decodedPassword =  await bcrypt.compare(parsedData.data?.password ?? "", user.password);

        if(!decodedPassword) {
            res.status(403).json({
                message: "Wrong credentials"
            })
            return
        }

        const secretKey = JWT_SECRET
        if(!secretKey) {
            res.json({
                message: "secret key error"
            })
            return
        }
        const userId = user.id;
        const token = jwt.sign({
            userId
        }, secretKey)
        res.json({
            token: token
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
    
})


app.post("/room",middleware,async (req, res) => {
    try {
        const userId = req.userId
        const name = req.body.name?.trim()
        if(!name) {
            res.status(400).json({
                message: "room name is required"
            })
            return
        }
        const existingRoom = await prismaClient.room.findUnique({
            where: {
                slug: name
            }
        })
    
        if(existingRoom) {
            res.status(400).json({
                message: "Room already exits"
            })
            return
        }
    
        const room = await prismaClient.room.create(
            {
                data: {
                    slug: name,
                    adminId: userId 
                }
            }
        )
    
        res.json(
            {
                roomId: room.id
            }
        )
    } catch (err) {
        res.status(500).json({
            message: "something went wrong"
        })
    }
})


app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    })
    res.json({
        messages
    })

});


app.listen(3001);