/* global chrome */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import wheel from './load.png'
import "./App.css"

function App() {
  const [view, setView] = useState(0);
  const [url, setURL] = useState("")
  const [userData, setUserData] = useState({userID: "", rank: 0})
  const [error, setError] = useState("");

  chrome.tabs.query({
      active: true,
      currentWindow: true,
  },
  (tabs) => {
    console.log(tabs[0].url)
      setURL(tabs[0].url);
      console.log()
  });

 
  function checkProperURL(url) {
    console.log("inside checkProperURL")
    if(url.includes("github")) {
        return "github"
    } else if (url.includes("stackoverflow")) {
        return "stackoverflow"
    }
    return false;
  }

  function getUserID(url, siteName) {
    console.log("inside getUserID")
    let userID = ""

    if(siteName === "github") {
      userID = url.replace("https://github.com/","")
      console.log(userID)
    } else {
      userID = (url.replace("https://stackoverflow.com/users/", "").split("/"))[0]
    }
    return userID
  }
  
  function getRank(userID, siteName) {
    if (siteName === "github") {

      const headers = {
        "Content-Type": "application/json",
        "githubId": userID
      }

      axios.post("https://ratings-api.dev.reputationaire.com/api/request-rating", {
        "Content-Type": "application/json",
        "githubId": userID
      })
      .then((res) => {
        return axios.get(`https://ratings-api.dev.reputationaire.com/api/result?id=${res.data.message.uuid_github}&access=f62345e8-9378-425b-b122-ecb4a9610a38`)
      })
      .then((res) => {
        setUserData({"userID": userID, "rank": res.data.message.average})
        setView(3)
      })
      .catch((err) => {
        console.log("in error", err)
        setError(`${err}`)
        setView(2)
      })
    } else if (siteName === "stackoverflow") {
      axios.post("https://ratings-api.dev.reputationaire.com/api/stackoverflow/request-rating", {
        "Content-Type": "application/json",
        "stackoverflowId": userID
      })
      .then((res) => {
        console.log("stackoverflow",res)
        return axios.get(`https://ratings-api.dev.reputationaire.com/api/stackoverflow/result?id=${res.data.message.uuid_stackoverflow}&access=f62345e8-9378-425b-b122-ecb4a9610a38`)
      })
      .then((res) => {
        setUserData({"userID": userID, "rank": res.data.message.average})
        setView(3)
      })
      .catch((err) => {
        console.log("in error", err)
        setError(`${err}`)
        setView(2)
      })
    } else {
      setView(4)
    }

  }
  

  useEffect(() => {
    let siteName = checkProperURL(url)
    let userID = ""
    if(siteName === "github" || siteName === "stackoverflow") {
      userID = getUserID(url, siteName)
      setUserData({...userData, "userID": userID})
      setView(1)
      getRank(userID, siteName)
    } else {
      setView(4)
    }
  },[url])

  return (
      <div className="App">
        {view === 0 && (
          <div>{url}</div>
        )}
        {view === 1 && (
          <div className="loading">
            <img className="loading-img" src={wheel} alt=""/>
            <h2 className="loadingText"> Crunching 50 million developer profiles...</h2>
          </div>
        )}
         {view === 2 && (
          <div>
            <h2>ERROR</h2>
            <section>{error}</section>
          </div>
        )}
        {view === 3 && (
          <div className="stats">
            <span><b>Username:</b> {userData.userID}</span>
            <span><b>Rank:</b> {Number(userData.rank.toFixed(5))}</span> 
          </div>
        )}
        {view === 4 && (
         <h2>Invalid Page</h2>
        )}
      </div>
  );
}

export default App;
