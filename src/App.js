import { useState, useEffect } from "react"
import {useRef} from 'react';

function App() {
  const [value, setValue] = useState (null)
  const [message, setMessage] = useState (null)
  const [previousChat, setPreviousChat] = useState ([])
  const [currentTittle, setCurrentTittle] = useState (null)
  const inputRef = useRef(null);
  
  const [pdfString, setPdfString] = useState(null)
  
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  //const [fileObj, setFileObj] = React.useState();

  const handleUploadClick = () => {
    // 👇️ open file input box on click of another element
    inputRef.current.click();
  };

  
  const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0]
     if (!fileObj) {
      console.log ("File Object empty")
       return;
     }

    console.log('File object is', fileObj);
    localStorage.setItem('myData', fileObj);

    // 👇️ reset file input
    //event.target.value = null;

    // 👇️ is now empty
    console.log(event.target.files);

    // 👇️ can still access file object here
    console.log(fileObj);
    console.log(fileObj.name);

    const formData = new FormData();

		formData.append('File', fileObj);
    const createXHR = () => new XMLHttpRequest()

		fetch(
			'http://127.0.0.1:5000/upload',
			{
				method: 'POST',
				body: formData,
        createXHR,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
  };

  const createNewChat = () => {
    setMessage (null)
    setValue ("")
    setCurrentTittle (null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTittle (uniqueTitle)
    setMessage (null)
    setValue ("")
  }

  const getMessages = async () => {
    const options = {
        method: "POST",
        /*body : JSON.stringify({
            message: value
        }),*/
        body : JSON.stringify({
            message: value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const response = await fetch('http://localhost:8000/completions', options)
        const data = await response.json()
        console.log('In APP.js' + data.choices[0].text)
        setMessage(data.choices[0].text)
    }catch (error) {
        console.error(error)
    }
}

useEffect (() => {
    console.log('current Title ' + currentTitle)
    console.log('value ' + value)
    console.log('message ' + message)
    if(!currentTitle && value && message) {
        setCurrentTitle(value)
    }

    if (currentTitle && value && message) {
        setPreviousChats( prevChats => (
            [...prevChats,
                {
                    title:currentTitle,
                    role: "user",
                    content: value
                },
                {
                    title: currentTitle,
                    role: "Assistant",
                    content: message
                }]
        ))
    }

}, [message, currentTitle])

//console.log(previousChats)

const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)

const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}> + New Chat </button>
        <ul className="history"> 
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav><p>Made by VK</p></nav>
      </section>
      <section className="main">
        {currentTittle && <h1>PDF GPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
            <div>
              <input style={{display: 'none'}} ref={inputRef} type="file" onChange={handleFileChange}/>
              <button onClick={handleUploadClick}>PDF Upload</button>
            </div>
          </div>
          <p className="info">
            Using ChatGPT in back and this is some embedding thing goin on
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
