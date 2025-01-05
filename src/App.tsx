import React, {useState} from 'react';
import './App.css';
import MainMenu from './components/MainMenu';
import Questionaire from "./components/Questionaire";

const App: React.FC = () => {
  let [isStarted, setIsStarted] = useState<boolean>(false);

  return (
    <main className="App">
      {!isStarted && <MainMenu setIsStarted={setIsStarted} />}
      {isStarted && <Questionaire isStarted={isStarted}/>}
    </main>
  );
}

export default App;
