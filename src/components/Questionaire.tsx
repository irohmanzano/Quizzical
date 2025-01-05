import React, {useState, useEffect, useRef} from "react";
import "../css/Questionaire.css";
import { nanoid } from "nanoid";
import QuizItem from "./QuizItem";

interface qData {
  response_code: number
  results: {
    type: string
    difficulty: string
    category: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
  }[]
}

interface choice {
  choice: string
  isSelected: boolean
  isCorrect: boolean
}

interface processedQData {
  id: string
  question: string
  choices: choice[]
}

interface PropsQuestionaire {
  isStarted: boolean
}

const Questionaire: React.FC<PropsQuestionaire> = ({isStarted}) => {
  function calcScore(): number {
    let score = 0;
    quizData.forEach(item => {
      item.choices.forEach(choice => {
        if(choice.isCorrect && choice.isSelected) {
          score++
        }
      });
    })
    return score;
  }

  function shuffleArray(array: choice[]): choice[] {
    let newArray: choice[] = [...array];
    if(array.length === 0) {
      return [];
    }

    for(let i = 0; i < newArray.length; i++) {
      let temp: choice;
      let randNum = Math.floor(Math.random() * newArray.length);
      temp = newArray[i];
      newArray[i] = newArray[randNum];
      newArray[randNum] = temp;
    }
    return newArray;
  }

  let processedQData = useRef<processedQData[]>([]);
  let [quizData, setQuizData] = useState<processedQData[]>([]);
  let [isChecked, setIsChecked] = useState<boolean>(false);
  let renderQuestionaire: JSX.Element[] = quizData.map(item => {
    return (
      <QuizItem key={nanoid()} {...item} processedQData={processedQData} setQuizData={setQuizData} isChecked={isChecked} />
    );
  });

  useEffect(() => {
    async function fetchData(): Promise<boolean> {
      let temp: processedQData[];
      if(processedQData.current.length !== 0){return true}
      try {
        const res: Response = await fetch("https://opentdb.com/api.php?amount=5");
        const data: qData = await res.json();
        temp = data.results.map(item => (
          {
            id: nanoid(),
            question: item.question,
            choices: [{
              choice: item.correct_answer,
              isSelected: false,
              isCorrect: true
            },
            ...item.incorrect_answers.map(choice => (
              {
                choice: choice,
                isSelected: false,
                isCorrect: false
              }
            ))]
          }
        ));
        processedQData.current = temp.map(item => (
            {
              ...item,
              choices: shuffleArray(item.choices)
            }
          )
        );
        setQuizData([...processedQData.current]);
        return true;
      }
      catch {
        return false
      }
    }
    
    async function executeFetch(): Promise<void> {
      let delay: number = 3000
      for(let i = 0; i < 5; i++) {
        let res = await fetchData();
        if(res) {
          return;
        }
        else {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }
  if(processedQData.current.length !== 0) {
    setQuizData(processedQData.current);
  }
  else {
    executeFetch();
  }
  }, [isChecked]);


  return (
    <div className="Questionaire">
      <div className="Questionaire_items">
        {isStarted && processedQData.current.length === 0 && <p>Fetching data...</p>}
        {isStarted && processedQData.current.length > 0 && renderQuestionaire}
      </div>
      <div className="Questionaire_results">
        {isChecked && <h2 className="Questionaire__score">{`You scored ${calcScore()}/${quizData.length} correct answers`}</h2>}
        {isStarted && processedQData.current.length > 0 && <button onClick={() => {
          if(!isChecked) {
            setIsChecked(true);
          }
          else {
            setIsChecked(false);
            processedQData.current = [];
            setQuizData(processedQData.current);
          }
          }} className="Questionaire__check-ans">{!isChecked ? "Check answers" : "Play again"}</button>}
      </div>
    </div>
  );
}

export default Questionaire;