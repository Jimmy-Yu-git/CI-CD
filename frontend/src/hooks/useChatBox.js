import { useState,useEffect } from "react";
const server = new WebSocket('ws://localhost:4000');
server.onopen = () => console.log('Server connected.');


const useChatBox = () => {
    
    // useEffect(() => {
    //     forceUpdate()
    // }, [msg]);
    //console.log(msg)
    const SendData = async (data) => {
        await server.send(
            JSON.stringify(data)
        );
        await getdata();
    };
    const getdata = () => {
            server.onmessage = (m) => {
            let data = JSON.parse(m.data)
            console.log(data)
            onEvent(data)
        }
        const onEvent = (e) => {
            const { type } = e;
    
            switch (type) {
                case 'Chat': {
                    console.log(msg)
                    //[]
                    setMessages(e.data.messages);
                    //messages = e.data.messages;
                    
                    break;
                }
                case 'Message': {
                    console.log(msg)
                    // let msgs = msg;
                    // console.log(msgs)
                    // msgs = msgs.push(e.data.message);
                    setInput(e.data.message);
                    break;
                }
            }
        };
    }
    




    const [chatBoxes, setChatBoxes] = useState([]);
    const [msg, setMessages] = useState([]);
    const [inputmsg,setInput] = useState([]);
    console.log(msg)//[{},{}]
    console.log(chatBoxes)
    const createChatBox = (friend, me, setActiveKey) => {
        //比對字串大小

        SendData({
            type: 'Chat',
            data: { name: me, friend: friend },
        })

        const newKey = me <= friend ?
            `${me}_${friend}` : `${friend}_${me}`;
        if (chatBoxes.some(({ key }) => key === newKey)) {
            throw new Error(friend +
                "'s chat box has already opened.");
        }
        const newChatBoxes = [...chatBoxes];
        newChatBoxes.push({ friend, key: newKey, chatLog:msg});
        console.log(msg)
        setChatBoxes(newChatBoxes);
        setActiveKey(newKey);


    };


    const removeChatBox = (targetKey, activeKey, setActiveKey) => {
        let newActiveKey = activeKey;
        //console.log(activeKey); 
        //console.log(targetKey);   
        //index before
        let lastIndex;
        chatBoxes.forEach(({ key }, i) => {
            if (key === targetKey) { lastIndex = i - 1; }
        });
        const newChatBoxes = chatBoxes.filter(
            (chatBox) => chatBox.key !== targetKey);
        if (newChatBoxes.length) {
            if (newActiveKey === targetKey) {
                if (lastIndex >= 0) {
                    newActiveKey = newChatBoxes[lastIndex].key;
                } else { newActiveKey = newChatBoxes[0].key; }
            }
        } else newActiveKey = ""; // No chatBox left
        setChatBoxes(newChatBoxes);
        setActiveKey(newActiveKey);
    };

    const sendMessage = (payload) => {
        console.log(payload);// key:11_1 body:'messenge'
        SendData({
            type: 'Message',
            data: { key: payload.key, body: payload.body, me: payload.sender },
        })
    };

    return { chatBoxes, createChatBox, removeChatBox, sendMessage,msg,inputmsg };
};
export default useChatBox;
