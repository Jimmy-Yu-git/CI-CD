import './App.css';
import SignIn from './container/signin';
import ChatRoom from './container/chatroom'
import { useState, useEffect } from "react";
import { message } from "antd"
const LOCALSTORAGE_KEY = "save-me";
const App = () => {
	const [signIn, setSignIn] = useState(false);
	const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
	const [me, setMe] = useState(savedMe || "");
	const displayStatus = (payload) => {
		if (payload.msg) {
			const { type, msg } = payload
			//console.log(payload)
			const content = {
				content: msg, duration: 1
			}
			switch (type) {
				case 'success':
					message.success(content)
					break
				case 'error':
				default:
					message.error(content)
					break
			}
		}
	}
	useEffect(() => {
		if (signIn) {
			localStorage.setItem(LOCALSTORAGE_KEY, me);
		}
	},[signIn])
	return (
		<div className="App">
			{signIn ? (<ChatRoom me={me} displayStatus = {displayStatus}/>) : (<SignIn setMe={setMe} me={me} setSignIn={setSignIn} displayStatus={displayStatus} />)}
		</div>
	);

};
export default App;