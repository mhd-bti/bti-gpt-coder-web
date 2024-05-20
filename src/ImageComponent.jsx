import React, { useState, useEffect, useRef } from "react";

const ImageComponent = (props) => {
    const fileupRef = useRef([]);

    const handleInputFile = (e) => {
        props.setIsLoading(false);
        const files = e.target.files;
        if (!files) {
            console.log("canceled.")
            return;
        }

        // FileListのままだとforEachが使えないので配列に変換する
        const fileArray = Array.from(files);

        fileArray.forEach((file) => {
            console.log("reading file.name: ", file.name);
            console.log("reading file.size: ", file.size);

            if (props.images.map(el => el.name).includes(file.name)) {
                console.log("duplicate file.name: ", file.name);
                return;
            }

            // ファイルを読み込むためにFileReaderを利用する
            const reader = new FileReader();
            // ファイルの読み込みが完了したら、画像の配列に加える
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result !== "string") {
                    return;
                }
                props.setImages((prevImages) => [...prevImages, { file: result, name: file.name, size: file.size }]);
            };
            // 画像ファイルをbase64形式で読み込む
            reader.readAsDataURL(file);
        });

        // 連続して同ファイルを選択した場合の対応
        e.target.value = "";
    };

    const handleFileup = () => {
        // props.setIsLoading(true); 

        fileupRef.current.click();
    }

    const handleFileupClick = (e) => {
        console.log("fileupRef.current.click()");
        e.target.value = null; // 入力をリセットして同じファイルを再度選択可能にする
        props.setIsLoading(true);
        // fileupRef.current.click();
    }

    const handleClear = () => {
        if (props.images.length) props.setImages([]);
    }

    useEffect(() => {
        if (!props.images.length) handleClear();
    }, [props.images]);

    return (
        <div className="relative border-2 border-red-200 bg-red-100 w-[600px] h-[600px] flex flex-col space-y-4">
            {props.images.map((file) => <p key={file.name}>{file.name} [{file.size}B]</p>)}
            <button onClick={() => handleFileup()}>ファイル選択</button>
            <input
                hidden
                ref={fileupRef}
                type="file"
                multiple // 画像を複数選択できるようにする
                accept="image/*"
                onClick={(e) => handleFileupClick(e)}
                onChange={(e) => { console.log("onChange"); handleInputFile(e) }}
            />
            <button onClick={() => { handleClear() }}>Clear</button>
        </div>
    );
};

export default ImageComponent;
