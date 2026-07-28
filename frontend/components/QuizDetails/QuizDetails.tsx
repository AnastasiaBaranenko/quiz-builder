'use client';

import { Quiz } from '../../services/api';
import style from './QuizDetails.module.css';

interface QuizDetailsProps {
  quiz: Quiz;
  onDelete: (id: string) => void;
}

export default function QuizDetails({ quiz, onDelete }: QuizDetailsProps) {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.title}>{quiz.title}</h1>
        <p className={style.desc}>{quiz.description}</p>
        <button
          className={style.btn}
          type="button"
          onClick={() => onDelete(quiz.id)}
        >
          Delete Quiz
        </button>
      </div>
      <div className={style.divContent}>
        <h2 className={style.headline}>Questions:</h2>
        <div className={style.questionsList}>
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
              <div key={index} className={style.questionCard}>
                <h3 className={style.heading}>
                  {index + 1}. {question.text}
                </h3>
                <p className={style.desc}>Type: {question.type}</p>
                <ul className={style.ul}>
                  {question.options.map((option, optIndex) => (
                    <li className={style.li} key={optIndex}>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className={style.desc}>No questions in this quiz.</p>
          )}
        </div>
      </div>
    </div>
  );
}
