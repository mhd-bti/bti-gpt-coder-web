import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './App.css';

import SourceCodeDisplay from './SourceCodeDisplay.jsx';
import ImageComponent from './ImageComponent.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

const envModels = import.meta.env.VITE_OPENAI_API_MODELS ? import.meta.env.VITE_OPENAI_API_MODELS.split(',') : ['gpt-4o'];

const App = () => {
  const [input, setInput] = useState('');
  const [images, setImages] = useState([]);
  const [codes, setCodes] = useState([]);
  const [preface, setPreface] = useState('');
  const [afterword, setAfterword] = useState('');
  const [chatId, setchatId] = useState('');
  const [chatIds, setchatIds] = useState([]);
  const [isTest, setIsTest] = useState(false);
  const [isAutoDeploy, setIsAutoDeploy] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('あなたは、[React]に精通したプロのITエンジニアです。\nユーザーの入力内容を元に完全なソースコードを生成してください。\nなお、生成するソースコードは、最上位の親コンポーネントであるApp（ファイル名：App.jsx）および、必要な子コンポーネントを全て生成してください。\n\n# 出力フォーマット\n以下の情報を出力してください。\n1.追加npmライブラリ\n - 追加でインポートが必要なライブラリを列挙する\n2.ソースコード内容\n - 実行可能な完全なソースコードを出力する\n - 出力は、「ソースコードJSONフォーマット」に従う\n\n# ソースコードJSONフォーマット\n必ず完全なJSON形式のデータだけを出力してください。\nJSON以外は絶対に出力しないでください。\nJSONなので、{で始まり、}で終わるようにしてください。\n\n{\n  "result": [\n    {\n      "filename": "ファイル名",\n      "code": "コードの内容",\n      "description": "コードの簡単な説明"\n    }\n  ]\n}\n\nJSONデータは必ず以下に従ってください。\n- JSONデータはひとつだけ出力する\n- 結果が1件のみの場合でも、resultは配列とする\n- 結果が0件の場合は、resultは空の配列ととする\n- 結果には、filename、code、descriptionを必ず含め、値がない場合には空文字""とする\n- filenameは、srcディレクトリからの相対パスとする。例えば、ファイルのパスがsrc/components/Component.jsxであれば、"filename": "components/Component.jsx"となる');
  const [sendSystemPrompt, setSendSystemPrompt] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [demoAdded, setDemoAdded] = useState(false);

  // コード生成APIからのレスポンスを表示する
  const handleSubmit = async () => {
    if (!projectName.trim()) {
      alert('プロジェクト名を入力してください。');
      return;
    }

    setIsLoading(true);
    axios.post('http://localhost:5000/api/generate-code', {
      projectName: projectName,
      prevId: chatId,
      userInput: input,
      images: images,
      isTest: isTest,
      model: model,
      systemPrompt: sendSystemPrompt ? systemPrompt : ""
    })
      .then((response) => {
        setIsLoading(false);
        clearInput();
        console.log("response: ", response);

        setPreface(response.data.output.preface);
        setAfterword(response.data.output.afterword);

        setCodes(response.data.output.codes);
        console.log("codes: ", response.data.output.codes);

        setchatIds([{ id: response.data.output.id, prompt: input }, ...chatIds]);

        setchatId(response.data.output.id);
        console.log("chatId: ", response.data.output.id);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  // 入力クリア
  const clearInput = () => {
    setInput('');
    setImages([]);
    setCodes([]);
    setPreface('');
    setAfterword('');
  }

  // プロジェクトリセット
  const handleReset = () => {
    setProjectName('');
    setchatId('');
    setchatIds([]);
    setDemoAdded(false);
    clearInput();
  };

  // ローディングスピナーを閉じる
  const handleCloseSpinner = () => {
    console.log("handleCloseSpinner");
    setIsLoading(false);
  };

  const handleAddDemo = () => {
    console.log("handleAddDemo: ", demoAdded);
    
    if (!projectName.trim()) {
      alert('プロジェクト名を入力してください。');
      return;
    }

    // デモ追加済に設定
    setDemoAdded(true);

    axios.post('http://localhost:5000/api/add-demo', {
      projectName: projectName
    })
      .then((response) => {
      })
      .catch((error) => {
        // 失敗時にはデモ未追加にする
        setDemoAdded(false);
        console.log(error);
      });
  }

  useEffect(() => {
    console.log("images: ", images);
  }, [images]);

  useEffect(() => {
    if (chatId) {
      setSendSystemPrompt(false);
    } else {
      setSendSystemPrompt(true);
    }
  }, [chatId]);

  return (
    <div className="main-container">
      {/* コード生成中にローディングスピナーを表示する */}
      {isLoading && <LoadingSpinner onClose={handleCloseSpinner} />}
      <h1>BTI GPT Coder DX</h1>
      {/*  */}
      <div>
        <h2>プロジェクト名</h2>
        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter your project name here" />
        <button onClick={handleReset} className="button-secondary">Reset</button>
        <button onClick={handleAddDemo} className={demoAdded ? "button-secondary" : "button-primary"} disabled={demoAdded}>Add Demo</button>
      </div>
      {/* チャット履歴選択 */}
      <div>
        <h2>チャット履歴ID</h2>
        <select value={chatId} onChange={(e) => setchatId(e.target.value)}>
          {chatIds.map((value) => <option value={value.id} key={value.id}>{value.id} - {value.prompt.substring(0, 20)}</option>)}
        </select>
      </div>
      {/* システムプロンプト入力 */}
      <div>
        <h2>システムプロンプト</h2>
        <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows="10" cols="80" placeholder="Enter your programming request here" />
        <input type="checkbox" checked={!sendSystemPrompt} onChange={(e) => setSendSystemPrompt(e.target.checked)} />システムプロンプトを送信しない（通常は、最初の指示でのみシステムプロンプトを送信します）
      </div>
      {/* ユーザープロンプト入力 */}
      <div>
        <h2>ユーザープロンプト</h2>
        <p>以下にAIへの指示を入力してください。（例：「"Hello, World!"を表示するアプリを作成して」）</p>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows="10" cols="80" placeholder="Enter your programming request here" />
      </div>
      {/* 画像コンポーネント */}
      <ImageComponent images={images} setImages={setImages} setIsLoading={setIsLoading} />
      {/* プロンプト入力エリア */}
      <div>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {envModels.map((model) => <option value={model} key={model}>{model}</option>)}
        </select>
        <input type="checkbox" checked={isTest} onChange={(e) => setIsTest(e.target.checked)} /> test mode<br />
        <button onClick={handleSubmit} className="button-primary">Generate Code</button>
      </div>
      {/* あとがき表示 */}
      <div>
        <pre>{preface}</pre>
        {
          codes.map((code, i) =>
            <div key={i}>
              <SourceCodeDisplay projectName={projectName} code={code} language="javascript" index={i + 1} isAutoDeploy={isAutoDeploy} />
            </div>
          )
        }
        <pre>{afterword}</pre>
      </div>
    </div >
  );
};

export default App;
