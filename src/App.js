import "./App.css";
import Bottom from "./Bottom";
import Head from "./Head";
import Middle from "./Middle";
function App() {
  // head - A 아이콘
  // body - 중앙의 사각형 틀 내용
  // bottom - 최하단의 API 사용르 위한 저작권 표시
  return (
    <div className="App">
      <div className="head">
        <Head />
      </div>
      <div className="body">
        <Middle />
      </div>
      <div className="bottom">
        <Bottom />
      </div>
    </div>
  );
}

export default App;
