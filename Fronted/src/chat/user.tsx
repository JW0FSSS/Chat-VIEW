import { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Checks } from '../icons/checks';
import { messageI } from '../types/types';

const socket=io('http://localhost:8000')


export function User({from,to}:{from:number,to:number}) {
  const [message, setMessage] = useState('')
  const [prevMessages,setPrevMessages]=useState<messageI[]>([])
  const [llego,setLlego]=useState(0)
  const divRef=useRef<HTMLDivElement>(null)

  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setMessage(e.target.value)
  }
  
  const handleMessage=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    
    socket.emit('chat',{message,from,to})
    setMessage('')
  }
  
  const handleView=(id:number| undefined)=>{
    if (!id) return
    socket.emit('view',{id,from,to})
  }
  
  useEffect(()=>{
    socket.on('connect',()=>{
      socket.emit('need messages',{from,to})
    })
    socket.on('send messages',(data)=>{
      setPrevMessages(data)
      socket.emit('llego','data')
    })
    socket.on('si le llego',data=>{
      setLlego(Math.random())
    })
    
  },[])

  useEffect(()=>{
    if (!divRef.current) return
      divRef.current.scrollTop=divRef?.current.scrollHeight
  },[prevMessages])

  return (
    <div className='max-w-2xl mx-auto h-screen bg-black text-white my-0 flex flex-col pb-5 '>  
    <div className='bg-white/10 py-1 text-lg pb-2'>
      <h1 className='ml-2'>{prevMessages?.find(user=>user?.from_id==from)?.to?.name}</h1>
    </div>
      <div className='flex-grow w-full px-2 pt-4 bg-white/30 gap-4 flex flex-col overflow-x-auto pb-4 ' ref={divRef} id='container'>
        
        {prevMessages.length>0?prevMessages.map((message,i)=>{
          const date=new Date(message?.createdAt).toTimeString().split(' ')[0]
          const [hour,minute]=date.split(':')
          const trueHour=+hour%12
          const renderHour=trueHour>0?trueHour:hour
          const timeZone=trueHour>0?'pm':'am'
          return(
            <article key={message?.id} className={`flex ${message.from_id==from?"justify-end":""}`} >
              <div className={`inline-flex gap-x-3 px-2 bg-white/20 rounded-bl-md rounded-br-md ${message.from_id==1?"rounded-tl-md":"rounded-tr-md"} `} onClick={()=>message.to.id==from?handleView(message.id):null}>
              <p>{message?.message}</p>
              <p className='text-xs self-end'>{renderHour}:{minute} {timeZone}</p>
              {i==(prevMessages.length-1)&&llego&&<span className={`flex items-end rounded-full ${message.viewAt?"text-[#46ff65]":""}`}><Checks/></span>}
              </div>
            </article>
          )
        }):<h1 className='text-center max-w-[90%] text-wrap mx-auto text-xl'>Los mensajes son manejados de tu base de datos.No te olvides tener minimo dos usuarios. 
          Puedes cambiar usar los usuarios modificando las props del user component por los ids de tus usuarios en tu base de datos.
         </h1>}
      </div>
      <form action="" className='w-full flex gap-x-2 px-2 pt-1' onSubmit={handleMessage}>
        <input type="text" placeholder='your message...'  onChange={handleChange} 
        onClick={()=>prevMessages[prevMessages.length-1].to.id==from?handleView(prevMessages[prevMessages.length-1]?.id):null} 
        value={message} 
        className='flex-grow bg-transparent rounded-xl pl-2 outline-none border-[1px] border-white/20'/>
        <button className='rounded-xl bg-[#25526d] p-2'>Send</button>
      </form>
    </div>
  )
}