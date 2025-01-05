import "../css/MainMenu.css";

interface PropsMainMenu {
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const MainMenu: React.FC<PropsMainMenu> = ({setIsStarted}) => {
  function startQuiz(): void {
    setIsStarted(prev => !prev);
  }


  return (
    <div className="MainMenu">
      <h1 className="MainMenu__title">Quizzical</h1>
      <p className="MainMenu__text">Some description if needed</p>
      <button onClick={startQuiz} className="MainMenu__start">Start quiz</button>
    </div>
  );
}

export default MainMenu;