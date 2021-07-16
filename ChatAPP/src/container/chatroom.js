import "../App.css";
import ChatModal from "../component/chatModels"
//import useChatBox from "../hooks/useChatBox"
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import useChat from "../hooks/useChat"
import { useState, useEffect } from "react";
import { Tabs, Input ,Tag } from "antd";
import {
    CREATE_CHATBOX_MUTATION,
    CREATE_MESSAGE_MUTATION,
    CHATBOX_QUERY,
    MESSAGE_SUBSCRIPTION,
    AllMessage_Sub,
} from '../graphql';
import { isTypeNode } from "graphql";
const { TabPane } = Tabs;
const ChatRoom = ({ me, displayStatus }) => {
    // const [chatBoxes, setChatBoxes] = useState([
    //     {
    //         friend: "Mary", key: "MaryChatbox",
    //         chatLog: []
    //     },
    //     {
    //         friend: "Peter", key: "PeterChatBox",
    //         chatLog: []
    //     }
    // ]);
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [ispush, setIspush] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [chatBoxes, setChatBoxes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const addChatBox = () => { setModalVisible(true); };
    const [activeKey, setActiveKey] = useState("")
    console.log(activeKey)
    const [addChat] = useMutation(CREATE_CHATBOX_MUTATION);
    const [addMessage] = useMutation(CREATE_MESSAGE_MUTATION);
    let myname
    let first
    let second
    useEffect(() => {
        console.log("active")
        console.log(activeKey)
        if (activeKey) {
            myname = activeKey.split("_")
            if (myname[0] === me) {
                first = myname[0]
                second = myname[1]
            }
            else {
                first = myname[1]
                second = myname[0]
            }
            setName1(first)
            setName2(second)
        }

    }, [activeKey])

    const { loading, error, data, subscribeToMore } = useQuery(CHATBOX_QUERY, {
        variables: {
            name1: name1,
            name2: name2,
            // name1: "jimmy",
            // name2: "peter",
        },
    })

    useEffect(() => {
        // console.log('11')
        subscribeToMore({
            document: AllMessage_Sub,
            // variables: {
            //     name1: name1,
            //     name2: name2,
            // },
            updateQuery: (prev, { subscriptionData }) => {
                // console.log(prev.chatbox.messages)
                // console.log(subscriptionData)
                // let newchat = chatBoxes
                // if (!subscriptionData.data.allmessage) {
                //     console.log("12445789")
                //     console.log(prev);
                //     newchat.push({ friend: name2, key: activeKey, chatLog: prev.chatbox.messages });
                //     console.log(newchat);
                //     setChatBoxes(newchat);
                //     return prev;
                // }
                const newMess = subscriptionData.data.allmessage.data
                // console.log(newMess);
                // newchat.push({ friend: name2, key: activeKey, chatLog: prev.chatbox.messages });
                // console.log(newchat);
                // setChatBoxes(newchat);
                // newchat = {friend : name2,key : activeKey ,chatLog : data};
                return {
                    ...prev,
                    // posts: [newPost, ...prev.posts]
                    chatbox: [...prev.chatbox.messages, newMess]
                }
            }
        })

        // let newchat = {friend : name2,key : activeKey ,chatLog : data};
        // console.log(newchat)
        // console.log("123")
    }, [subscribeToMore])


    let newbox = []

    console.log("render")
    console.log(chatBoxes)


    const sendMessage = (payload) => {
        console.log(payload);// key:11_1 body:'messenge'
        addMessage({
            variables: {
                key: payload.key,
                body: payload.body,
                me: payload.sender,
            },
        });

        // SendData({
        //     type: 'Message',
        //     data: { key: payload.key, body: payload.body, me: payload.sender },
        // })
    };

    //CHAT MODELS CALL
    const createChatBox = (friend, me) => {
        //比對字串大小
        // const { loading, error, data,refetch,subscribeToMore } = useQuery(CHATBOX_QUERY,{
        //     variables: {
        //         name1: me,
        //         name2: friend,
        //     },
        // });
        addChat({
            variables: {
                name1: me,
                name2: friend,
            },
        });
        setName1(me);
        setName2(friend);


        const newKey = [me, friend].sort().join('_');
        console.log(newKey)
        if (chatBoxes.some(({ key }) => key === newKey)) {
            throw new Error(friend +
                "'s chat box has already opened.");
        }
        const newChatBoxes = [...chatBoxes];
        const chatLog = [];
        newChatBoxes.push({ friend, key: newKey, chatLog });
        setChatBoxes(newChatBoxes);
        setActiveKey(newKey);
        setIspush(true);
    };

    const removeChatBox = (targetKey, activeKey) => {
        let newActiveKey = activeKey;
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
        } else newActiveKey = "";
        //No chatBox left
        setChatBoxes(newChatBoxes);
        setActiveKey(newActiveKey);

    };



    return (
        <>
            <div className="App-title">
                <h1>{me}'s Chat Room</h1>
            </div>
            <div className="App-messages">
                <Tabs type="editable-card"
                    activeKey={activeKey}
                    onChange={(key) => { setActiveKey(key);}}

                    //按+號時
                    onEdit={(targetKey, action) => {
                        if (action === "add") addChatBox();
                        else if (action === "remove") removeChatBox(targetKey, activeKey, setActiveKey)
                    }}
                >
                    {chatBoxes.map(({ friend, key, chatLog }) => {
                        return (
                            <TabPane tab={friend}
                                key={key} closable={true}>
                                {(typeof (data) === "undefined" || data.chatbox === null) ? (<p>Loading...</p>) :
                                    (data.chatbox.messages.length === 0 ? (<p>NO MESSAGE..</p>) : (
                                        data.chatbox.messages.map(({ sender, body }, i) => {
                                            if (sender[0].name !== me) {
                                                return (
                                                    <p ><Tag color = "blue" >{sender[0].name}</Tag> : {body}</p>
                                                )
                                            }
                                            else {
                                                return (
                                                    <p style={{ textAlign: "right" }}>{body} : <Tag color = "blue" >{sender[0].name}</Tag></p>
                                                )
                                            }
                                        })
                                    ))}
                            </TabPane>
                        );
                    }
                    )}
                </Tabs>
                <ChatModal
                    visible={modalVisible}
                    onCreate={({ name }) => {
                        createChatBox(name, me, setActiveKey);
                        setModalVisible(false);
                    }}
                    onCancel={() => {
                        setModalVisible(false);
                    }}
                />

            </div>
            <Input.Search
                value={messageInput}
                onChange={(e) =>
                    setMessageInput(e.target.value)}
                enterButton="Send"
                placeholder=
                "Enter message here..."
                onSearch={(msg) => {
                    if (!msg) {
                        displayStatus({
                            type: "error",
                            msg: "Please enter message.",
                        });
                        return;
                    } else if (activeKey === "") {
                        displayStatus({
                            type: "error",
                            msg: "Please add a chatbox first.",
                        });
                        setMessageInput("");
                        return;
                    }
                    sendMessage({ key: activeKey, body: msg, sender: me });
                    setMessageInput("");
                }}
            >
            </Input.Search>
        </>
    )

}
export default ChatRoom;