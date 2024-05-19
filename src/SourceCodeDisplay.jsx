// SourceCodeDisplay.jsx
import React, { useState } from 'react';

import axios from 'axios';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import './SourceCodeDisplay.css'; // CSSファイルのインポート

const SourceCodeDisplay = (props) => {
    const code = props.code;
    const language = props.language;
    const fileName = props.fileName;
    const index = props.index;
    const description = props.description;
    const [fileNameCopied, setFileNameCopied] = useState(false);
    const [iconCopied, setIconCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    if (!fileName) return null;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'fileName') {
            setFileNameCopied(true);
            setTimeout(() => {
                setFileNameCopied(false);
            }, 3000);
        } else if (type === 'icon') {
            setIconCopied(true);
            setTimeout(() => {
                setIconCopied(false);
            }, 3000);
        }
    };

    // コードを投稿する
    const handlePostCode = async (data) => {
        console.log("data: ");
        console.log(data);
        axios.post('http://localhost:5000/api/post-code', data)
            .then((response) => {
                console.log('response: ');
                console.log(response);
                console.log("response.data.result: ");
                console.log(response.data.result);

                if(response.data.result === "success"){
                    setIsVisible(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // if(!isVisible) return null;

    return (
        <div>
            <h2>[{index}] {fileName} <button onClick={() => { handlePostCode({ code: code, filename: fileName, description: description }); }}>Apply</button></h2>
            <p>{description}</p>
            <div className="code-container">
                <div className="code-header">
                    <span className="file-name" onClick={() => copyToClipboard(fileName, 'fileName')}>
                        {fileNameCopied ? 'copied!' : fileName}
                    </span>
                    <button onClick={() => copyToClipboard(code, 'icon')} className="copy-button">
                        {iconCopied ? 'copied!' : <FontAwesomeIcon icon={faCopy} />}
                    </button>
                </div>
                <SyntaxHighlighter language={language} style={tomorrow} customStyle={{ backgroundColor: '#000' }}>
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default SourceCodeDisplay;
