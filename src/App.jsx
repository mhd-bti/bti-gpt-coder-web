import React, { useState } from 'react';

import axios from 'axios';

import SourceCodeDisplay from './SourceCodeDisplay.jsx'

const App = () => {
  const [input, setInput] = useState('');
  const [codes, setCodes] = useState([{ 'filename': '', 'code': '', 'description': '' }]);
  const [chatId, setChatId] = useState('');

  // コード生成APIからのレスポンスを表示する
  const handleSubmit = async () => {
    setCodes([{ 'filename': '', 'code': '', 'description': '' }]);

    axios.post('http://localhost:5000/api/generate-code', { prevId: chatId, userInput: input })
      .then((response) => {
        console.log("response: ", response);

        setCodes(response.data.output.codes);
        console.log("codes: ", response.data.output.codes);

        setChatId(response.data.output.id);
        console.log("chatId: ", response.data.output.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReset = () => {
    setInput('');
    setCodes([{ 'filename': '', 'code': '', 'description': '' }]);
  };

  return (
    <div>
      <h1>Auto Programming Service</h1>
      <div>
        <input type="text" value={chatId} onChange={(e) => setChatId(e.target.value)} size="50" placeholder="Chat ID" />
      </div>
      <div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows="10" cols="50" placeholder="Enter your programming request here" />
      </div>
      <div>
        <button onClick={handleSubmit}>Generate Code</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {
        codes.map((code, i) =>
          <>
            <SourceCodeDisplay fileName={code.filename} code={code.code} language="javascript" description={code.description} index={i + 1} />
          </>
        )
      }
    </div >
  );
};

export default App;
