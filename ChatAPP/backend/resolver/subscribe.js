const Subscription ={
    message : {
        subscribe(parent, {name1,name2}, { db, pubsub }, info){
            // const box = db.ChatBoxModel.find(())
            const makeName = (name, to) => {
                return [name, to].sort().join('_');
            };
            const chatBoxName = makeName(name1,name2);
            return pubsub.asyncIterator(`new message ${chatBoxName}`);
        }
    },
    allmessage : {
        subscribe(parent, args, { pubsub }, info) {
          return pubsub.asyncIterator('allmessage');
        },
      },
}
export default Subscription;