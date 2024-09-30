const textElement = document.getElementById('text');
const text = "Argosへようこそ。365日どの端末からでも監視カメラをしようできます";
let index = 0;

function type() {
    if (index < text.length) {
        textElement.textContent += text.charAt(index); // 文字を一つずつ追加
        index++;
        setTimeout(type, 100); // 次の文字を表示するまでの遅延
    }
}

type(); // タイプ関数を呼び出す