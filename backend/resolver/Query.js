const Query ={
    users(parent,args,{db},info){
        return db.UserModel.find()
        .then(events => {
            return events.map(event => {
                return{...event._doc}
            })
        })
        .catch(err => {
            throw err;
        })
        
    },
    events(parent,args,{db},info){
        return db.Event.find()
            .then(events => {
                return events.map(event => {
                    return{...event._doc}
                })
            })
            .catch(err => {
                throw err;
            })
    },
    async chatbox(parent,{ name1, name2 },{db},info){
        const makeName = (name, to) => {
            return [name, to].sort().join('_');
        };
        const chatBoxName = makeName(name1, name2);
        let box = await db.ChatBoxModel.findOne({ name: chatBoxName });
        let nullbox = [];
        console.log(chatBoxName)
        console.log("11")
        console.log(box)
        return box
            // .populate('users')
            // .populate({ path: 'messages', populate: 'sender' })
            // .execPopulate();
    }

}
export default Query;