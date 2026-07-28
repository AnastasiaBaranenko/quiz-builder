import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllQuizzes, deleteQuiz } from '../../services/api';
import { Quiz } from '../../services/api';
import QuizList from '../../components/QuizList/QuizList';
import styles from '../Home.module.css';

export default function Page() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    } catch {
      console.error('Deletion error');
    }
  };

  return (
    <>
      <title>Quiz Builder</title>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}> Quiz Builder</h1>
          <p className={styles.desc}>
            Welcome to quizz builder. Create your own quizzes and browse others.
          </p>
          <Link href="/quizzes/create">
            <button className={styles.btn}>+ Create a quiz</button>
          </Link>
          <QuizList quizzes={quizzes} onDelete={handleDelete}></QuizList>
        </div>
      </main>
    </>
  );
}
