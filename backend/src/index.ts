import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const app=express()
const server=createServer(app)
const io=new Server(server,{cors:{origin:"*"}})
const prisma =new PrismaClient()




io.on('connection',(socket)=>{
    
    socket.join('room-101')
    
   socket.on('need messages',async(data)=>{
       const messages=await  prisma.message.findMany({where:{OR:[{from_id:data.from,to_id:data.id},{from_id:data.to,to_id:data.from}]},include:{from:true,to:true}})
        socket.emit('send messages',messages)
    })

    socket.on('chat',async(data)=>{
        const message=await prisma.message.create({data:{message:data?.message,from_id:data?.from,to_id:data?.to}})
        const messages=await  prisma.message.findMany({where:{OR:[{from_id:data.from,to_id:data.id},{from_id:data.to,to_id:data.from}]},include:{from:true,to:true}})
        io.to('room-101').emit('send messages',messages)
    })
    
    socket.on('llego',()=>{
        io.to('room-101').emit('si le llego','data')
    })
    socket.on('view',async(data)=>{
        await prisma.message.update({where:{id:data.id},data:{viewAt:true}})
        const messages=await prisma.message.findMany({where:{OR:[{from_id:data.from,to_id:data.to},{from_id:data.to,to_id:data.from}]},include:{from:true,to:true}})
        io.to('room-101').emit('send messages',messages)
    })
})


server.listen(8000,()=>console.log('server on http://localhost:8000'))