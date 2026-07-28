import { Request, Response } from 'express';
import { prisma } from '../server.js';

interface QuizParams {
  id: string;
}

interface QuestionItem {
  text: string;
  type: string;
  options: string[];
}

export const createQuiz = async (req: Request, res: Response) => {
  const { title, description, questions } = req.body;

  const formattedQuestions = questions.map((question: QuestionItem) => ({
    text: question.text,
    type: question.type,
    options: JSON.stringify(question.options ?? []),
  }));

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      questions: {
        create: formattedQuestions,
      },
    },
    include: {
      questions: true,
    },
  });

  res.status(201).json(quiz);
};

export const getAllQuizzes = async (req: Request, res: Response) => {
  const quizzes = await prisma.quiz.findMany({
    include: {
      _count: { select: { questions: true } },
    },
  });
  res.status(200).json(quizzes);
};

export const getQuizById = async (req: Request<QuizParams>, res: Response) => {
  const { id } = req.params;
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });
  if (!quiz) {
    return res.status(404).json({ message: 'Quiz not found' });
  }
  const formattedQuiz = {
    ...quiz,
    questions: quiz.questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
    })),
  };
  res.status(200).json(formattedQuiz);
};

export const deleteQuiz = async (req: Request<QuizParams>, res: Response) => {
  const { id } = req.params;
  try {
    const quiz = await prisma.quiz.delete({
      where: { id },
    });

    res.status(200).json(quiz);
  } catch {
    res.status(404).json({ message: 'Quiz not found' });
  }
};
