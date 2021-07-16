const Message = {
    sender(parent,args,{db},info){
        //console.log("parent.sender")
        //console.log(parent.sender)
        return Promise.all([
            //parent.sender.map((mId) =>
            db.UserModel.findById(parent.sender)]
        );
    }
}
export default Message;