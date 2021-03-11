const users=[]

const JoinUser = (id,username,room)=>{
   
    const user={id,username,room}

    users.push(user)
        // console.log(users)
    return user
}
const UserLeave = (id)=>{
    const index = users.findIndex(user=>user.id===id)
    if(index !== -1){
        const user = users.splice(index,1)[0]
        // console.log(user)

        return user
    }
}
const RoomUsers =(room)=>{
    return users.filter(user=>user.room===room)
}

module.exports = {JoinUser,UserLeave,RoomUsers}