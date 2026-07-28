'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import QuizDetails from '../../components/QuizDetails/QuizDetails';
import { getQuizById, deleteQuiz, Quiz } from '../../services/api';

export default function QuizDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      getQuizById(id).then((data) => setQuiz(data));
    }
  }, [id]);

  const handleDelete = async (quizId: string) => {
    await deleteQuiz(quizId);
    router.push('/quizzes');
  };

  if (!quiz) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <QuizDetails quiz={quiz} onDelete={handleDelete} />
    </div>
  );
}
