// SourceCodeDisplay.jsx
import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import './SourceCodeDisplay.css'; // CSSファイルのインポート

const SourceCodeDisplay = (props) => {
    const language = props.language;
    const isAutoDeploy = props.isAutoDeploy;
    const index = props.index;
    const code = props.code;
    const fileName = props.fileName;
    const description = props.description;
    const [fileNameCopied, setFileNameCopied] = useState(false);
    const [iconCopied, setIconCopied] = useState(false);
    const [isDeployed, setisDeployed] = useState(false);

    if (!fileName) return null;

    // コードをコピーする
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
    const handlePostCode =  () => {
        const data = {
            code: code,
            filename: fileName,
            description: description
        };

        console.log("data: ", data);
        axios.post('http://localhost:5000/api/post-code', data)
            .then((response) => {
                console.log('response: ');
                console.log(response);
                console.log("response.data.result: ");
                console.log(response.data.result);

                if (response.data.result === "success") {
                    setisDeployed(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // 自動投稿モードの場合
    if (isAutoDeploy && !isDeployed && fileName && code) {
        console.log("Auto deploy");
        handlePostCode();
    }

    // if(isDeployed) return null;

    return (
        <div>
            <h2>[{index}] {fileName} <button onClick={() => { handlePostCode() }}>{isDeployed ? 'Deployed' : 'Deploy'}</button></h2>
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
