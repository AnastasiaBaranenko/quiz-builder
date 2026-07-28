import axios from 'axios';

const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

type QuestionType = 'input' | 'radio' | 'checkbox';

export interface CreateQuestionItem {
  text: string;
  type: QuestionType;
  options: string[];
}

export interface Question extends CreateQuestionItem {
  id: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions?: Question[];
  _count?: {
    questions: number;
  };
}

export interface CreateQuiz {
  title: string;
  description: string;
  questions: CreateQuestionItem[];
}

export const createQuiz = async (data: CreateQuiz): Promise<Quiz> => {
  const res = await nextServer.post('/quizzes', data);
  return res.data;
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const res = await nextServer.get('/quizzes');
  return res.data;
};

export const getQuizById = async (id: string): Promise<Quiz> => {
  const res = await nextServer.get(`/quizzes/${id}`);
  return res.data;
};

export const deleteQuiz = async (id: string): Promise<void> => {
  const res = await nextServer.delete(`/quizzes/${id}`);
  return res.data;
};
