const Mutation = {

    async createChatBox(parent, { name1, name2 }, { db, pubsub }, info) {
        const makeName = (name, to) => {
            return [name, to].sort().join('_');
        };
        //const chatBoxName = makeName(name1, name2);
        const checkUser = async (db, name1, name2) => {
            const chatBoxName = makeName(name1, name2);
            let box = await db.ChatBoxModel.findOne({ name: chatBoxName });
            // const existing = await db.UserModel.findOne({ name1 });
            // console.log(existing.length);
            return box

        }
        const newUser = async (db, name1, name2) => {
            const chatBoxName = makeName(name1, name2);
            let box = await new db.ChatBoxModel({ name: chatBoxName }).save();
            return box;
        }
        if (!name1 || !name2) throw new Error("missing chatbox name");
        if (!(await checkUser(db, name1, name2))) {
            console.log("user doesn't existe for chatbox" + name1);
            await newUser(db, name1, name2);
        }
        else {
            console.log("exist");
            const chatBoxName = makeName(name1, name2);
            let box = await db.ChatBoxModel.findOne({ name: chatBoxName });
            
            return box;

        }
    },
    async createMessage(parent, { key, body, me }, { db, pubsub }, info) {
        const makeName = (name, to) => {
            return [name, to].sort().join('_');
        };
        const checkUser = async(name,db) => {
            const exist = await db.UserModel.findOne({name});
            if(exist) return exist;
            return new db.UserModel({name}).save();
        }
        const checkChatbox = async(boxname, participants,db) => {
            let box = await db.ChatBoxModel.findOne({name : boxname});
            if (!box) box = await new db.ChatBoxModel({name : boxname}).save();
            return box
            .populate('users')
            .populate({path : 'messages',populate: 'sender'})
            .execPopulate();
        }
        if (!body) throw new Error("missing inputmessage");
        let name
        let friend
        console.log(key);
        console.log(body);
        console.log(me);
        let str = key.split('_');
        if (me === str[0]) {
            name = str[0]
            friend = str[1]
        }
        else {
            name = str[1]
            friend = str[0]
        }
        const chatBoxName = makeName(name,friend);
        const sender = await checkUser(name,db);
        const receiver = await checkUser(friend,db);
        const chatbox = await checkChatbox(chatBoxName,[sender,receiver],db);
        const newMessage = new db.MessageModel({sender:sender,body:body});
        await newMessage.save();
        chatbox.messages.push(newMessage);
        await chatbox.save();
        // pubsub.publish(`new message ${chatBoxName}`, {
        //     message: {
        //       mutation: 'CREATED',
        //       data: newMessage ,
        //     },
        // });
        pubsub.publish('allmessage', {
            allmessage: {
              mutation: 'CREATED',
              data: newMessage,
            },
        });
        return newMessage;
    },





    async createEvent(parent, args, { db }, info) {
        console.log('mutated')
        const event = new db.Event({
            title: args.data.title,
            description: args.data.description,
            price: args.data.price,
        });
        return await event
            .save()
            .then(result => {
                console.log(result);
                return { ...result._doc, };
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }
}
export default Mutation;