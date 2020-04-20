/* global chrome */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [view, setView] = useState(0);
  const [url, setURL] = useState("")

  function createRequestURL(url) {

  }

  chrome.tabs.query({
      active: true,
      currentWindow: true,
  },
  (tabs) => {
    console.log(tabs[0].url)
      setURL(tabs[0].url);
  });

  useEffect(() => {
    if (u) {
      setView(1)
    }

  })

  return (
      <div>
        {view === 0 && (
          {url} 
        )}
        {view === 1 && (
          <div>Loading</div>
        )}
      </div>
  );
}

export default App;
