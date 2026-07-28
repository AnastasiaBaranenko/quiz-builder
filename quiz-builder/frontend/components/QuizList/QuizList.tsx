'use client';

import Link from 'next/link';
import { Quiz } from '../../services/api';
import style from './QuizList.module.css';

interface QuizListProps {
  quizzes: Quiz[];
  onDelete: (id: string) => void;
}

export default function QuizList({ quizzes, onDelete }: QuizListProps) {
  return (
    <div className={style.container}>
      {quizzes.map((quiz) => (
        <div key={quiz.id} className={style.content}>
          <h3 className={style.title}>{quiz.title}</h3>
          <p className={style.desc}>{quiz.description}</p>
          <span className={style.count}>
            Number of questions: {quiz._count?.questions ?? 0}
          </span>
          <div className={style.actions}>
            <Link href={`/quizzes/${quiz.id}`} className={style.btnDetails}>
              Details
            </Link>
            <button
              type="button"
              className={style.btn}
              onClick={() => onDelete(quiz.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
