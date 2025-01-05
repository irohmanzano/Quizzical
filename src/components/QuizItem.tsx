import React from 'react'
import { nanoid } from "nanoid"; 
import "../css/QuizItem.css";

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

interface QuizItem {
  id: string
  question: string
  choices: choice[]
  processedQData:  React.MutableRefObject<processedQData[]>
  setQuizData: React.Dispatch<React.SetStateAction<processedQData[]>>
  isChecked: boolean
}

const QuizItem: React.FC<QuizItem> = ({id, question, choices, processedQData, setQuizData, isChecked}) => {
  function choiceSelected(qid: string, qchoice: string): void {
    processedQData.current = [...processedQData.current.map(item => {
      if(qid !== item.id) {
        return {...item}
      }
      else {
        return (
          {
            ...item,
            choices: item.choices.map(choice => {
              if(choice.choice === qchoice) {
                return (
                  {
                    ...choice,
                    isSelected: true
                  }
                );
              }
              else {
                return (
                  {
                    ...choice,
                    isSelected: false
                  }
                );
              }
            })
          }
        );
      }

    })];
    setQuizData([...processedQData.current]);
  }

  return (
    <div className="QuizItem">
      <h4 className="QuizItem__question" dangerouslySetInnerHTML={{__html: question}}></h4>
      <div className="QuizItem__choices">
        {
          choices.map(item => {
            if(isChecked && item.isCorrect) {
              return <div key={nanoid()} className="QuizItem__choice-item correct" dangerouslySetInnerHTML={{ __html: item.choice }}></div>
            }
            else if(isChecked && item.isSelected && !item.isCorrect) {
              return <div key={nanoid()} className="QuizItem__choice-item wrong" dangerouslySetInnerHTML={{ __html: item.choice }}></div>
            }
            else if(isChecked) {
              return <div key={nanoid()} className="QuizItem__choice-item checked" dangerouslySetInnerHTML={{ __html: item.choice }}></div>
            }
            else if(!isChecked && item.isSelected) {
              return (
                <div onClick={() => choiceSelected(id, item.choice)} key={nanoid()} className="QuizItem__choice-item selected" dangerouslySetInnerHTML={{ __html: item.choice }}></div>
              );
            }
            else if(!isChecked && !item.isSelected) {
              return (
                <div onClick={() => choiceSelected(id, item.choice)} key={nanoid()} className="QuizItem__choice-item" dangerouslySetInnerHTML={{ __html: item.choice }}></div>
              );
            }
          })
        }
      </div>
    </div>
  )
}

export default QuizItem