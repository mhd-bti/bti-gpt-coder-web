import React, { useState, useEffect } from 'react';

import axios from 'axios';

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
  const [systemPrompt, setSystemPrompt] = useState('あなたは、[React]に精通したプロのITエンジニアです。\n以下の入力内容を元に完全なソースコードを生成してください。\nなお、生成するソースコードは、最上位の親コンポーネントであるApp（ファイル名：App.jsx）および、必要な子コンポーネントを全て生成してください。\n\n# 出力フォーマット\n以下の情報を出力してください。\n1.追加npmライブラリ\n - 追加でインポートが必要なライブラリを列挙する\n2.ソースコード内容\n - 実行可能な完全なソースコードを出力する\n - 出力は、「ソースコードJSONフォーマット」に従う\n\n# ソースコードJSONフォーマット\n完全なJSON形式のデータだけを必ず出力してください。\nJSON以外は絶対に出力しないでください。\nJSONなので、{で始まり、}で終わるようにしてください。\n\n{\n  "result": [\n    {\n      "filename": "ファイル名",\n      "code": "コードの内容",\n      "description": "コードの簡単な説明"\n    }\n  ]\n}\n\nJSONデータは必ず以下に従ってください。\n- JSONデータはひとつだけ出力する\n- 結果が1件のみの場合でも、resultは配列とする\n- 結果が0件の場合は、resultは空の配列ととする\n- 結果には、filename、code、descriptionを必ず含め、値がない場合には空文字""とする');
  const [sendSystemPrompt, setSendSystemPrompt] = useState(false);

  // コード生成APIからのレスポンスを表示する
  const handleSubmit = async () => {
    setIsLoading(true);
    axios.post('http://localhost:5000/api/generate-code', {
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

  const clearInput = () => {
    setInput('');
    setImages([]);
    setCodes([]);
    setPreface('');
    setAfterword('');
  }

  // 入力リセット
  const handleReset = () => {
    setchatId('');
    setchatIds([]);
    clearInput();
  };

  // ローディングスピナーを閉じる
  const handleCloseSpinner = () => {
    console.log("handleCloseSpinner");
    setIsLoading(false);
  };

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
    <div>
      {/* コード生成中にローディングスピナーを表示する */}
      {isLoading && <LoadingSpinner onClose={handleCloseSpinner} />}
      <h1>Auto Programming Service</h1>
      {/* チャット履歴選択 */}
      <div>
        <select value={chatId} onChange={(e) => setchatId(e.target.value)}>
          {chatIds.map((value) => <option value={value.id} key={value.id}>{value.id} - {value.prompt.substring(0, 20)}</option>)}
        </select>
      </div>
      {/* システムプロンプト入力 */}
      <div>
        <h2>システムプロンプト</h2>
        <input type="checkbox" checked={sendSystemPrompt} onChange={(e) => setSendSystemPrompt(e.target.checked)} />システムプロンプトを送信する<br />
        <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows="10" cols="80" placeholder="Enter your programming request here" />
      </div>
      {/* ユーザープロンプト入力 */}
      <div>
        <h2>ユーザープロンプト</h2>
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
        <button onClick={handleSubmit}>Generate Code</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {/* あとがき表示 */}
      <div>
        <pre>{preface}</pre>
        {
          codes.map((code, i) =>
            <div key={i}>
              <SourceCodeDisplay fileName={code.filename} code={code.code} language="javascript" description={code.description} index={i + 1} isAutoDeploy={isAutoDeploy} />
            </div>
          )
        }
        <pre>{afterword}</pre>
      </div>
    </div >
  );
};

export default App;
