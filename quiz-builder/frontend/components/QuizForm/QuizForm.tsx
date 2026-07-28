'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/router';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './QuizForm.module.css';
import { createQuiz } from '../../services/api';

const quizSchema = z
  .object({
    title: z.string().min(1, 'Please, enter minimum 1 value'),
    description: z.string().min(3, 'Please, enter minimum 3 value'),
    questions: z
      .array(
        z.object({
          text: z.string().min(1, 'Please, enter more than one value'),
          type: z.enum(['input', 'radio', 'checkbox']),

          options: z.array(
            z.object({
              text: z.string(),
              isCorrect: z.boolean().optional(),
            }),
          ),
        }),
      )
      .min(1, 'Please, enter more than one value.'),
  })
  .superRefine((data, ctx) => {
    data.questions.forEach((question, index) => {
      if (question.type === 'radio' || question.type === 'checkbox') {
        const validOptions = question.options.filter(
          (opt) => opt.text && opt.text.trim() !== '',
        );
        if (validOptions.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please add at least 2 options for this question type',
            path: ['questions', index, 'options'],
          });
        }
      }
    });
  });

type QuizFormData = z.infer<typeof quizSchema>;

export default function QuizForm() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      questions: [
        {
          text: '',
          type: 'input',
          options: [{ text: '' }],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormData) => {
    try {
      const formattedData = {
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          options: q.options.map((opt) => opt.text),
        })),
      };
      await createQuiz(formattedData);
      router.push('/quizzes');
    } catch (error) {
      console.error(error);
    }
  };

  const watchedQuestions = watch('questions');
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Create your quiz</h2>
      <div className={styles.content}>
        <label className={styles.label}>Quiz name</label>
        <input className={styles.input} {...register('title')} />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}
      </div>
      <div className={styles.content}>
        <label className={styles.descr}>Description</label>
        <input className={styles.input} {...register('description')} />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}
      </div>
      <h3 className={styles.heading}>Question</h3>

      {fields.map((field, index) => {
        const questionType = watchedQuestions?.[index]?.type;
        return (
          <div className={styles.options} key={field.id}>
            <input
              className={styles.input}
              {...register(`questions.${index}.text`)}
            />
            <select
              className={styles.select}
              {...register(`questions.${index}.type`)}
            >
              <option value="input">Text answer</option>
              <option value="radio">True/False</option>
              <option value="checkbox">Multiple choice</option>
            </select>
            {questionType === 'radio' && (
              <div>
                <label className={styles.inputRadio}>
                  <input
                    type="radio"
                    value="true"
                    className={styles.input}
                    {...register(`questions.${index}.options.0.text`)}
                  />
                  True
                </label>
                <label className={styles.inputRadio}>
                  <input
                    type="radio"
                    value="false"
                    className={styles.input}
                    {...register(`questions.${index}.options.1.text`)}
                  />
                  False
                </label>
              </div>
            )}
            {questionType === 'checkbox' && (
              <div className={styles.checkboxGroup}>
                <div>
                  <input
                    type="checkbox"
                    {...register(`questions.${index}.options.0.isCorrect`)}
                  />
                  <input
                    type="text"
                    placeholder="Option 1"
                    {...register(`questions.${index}.options.0.text`)}
                  />
                </div>
                <div className={styles.optionRow}>
                  <input
                    type="checkbox"
                    {...register(`questions.${index}.options.1.isCorrect`)}
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    {...register(`questions.${index}.options.1.text`)}
                  />
                </div>
                <div className={styles.optionRow}>
                  <input
                    type="checkbox"
                    {...register(`questions.${index}.options.2.isCorrect`)}
                  />
                  <input
                    type="text"
                    placeholder="Option 3"
                    {...register(`questions.${index}.options.2.text`)}
                  />
                </div>
                <div className={styles.optionRow}>
                  <input
                    type="checkbox"
                    {...register(`questions.${index}.options.3.isCorrect`)}
                  />
                  <input
                    type="text"
                    placeholder="Option 4"
                    {...register(`questions.${index}.options.3.text`)}
                  />
                </div>
              </div>
            )}

            <button
              className={styles.button}
              type="button"
              onClick={() => remove(index)}
            >
              Delete question
            </button>
          </div>
        );
      })}
      <div className={styles.buttons}>
        <button
          className={styles.btn}
          type="button"
          onClick={() =>
            append({ text: '', type: 'input', options: [{ text: '' }] })
          }
        >
          + Add a question
        </button>

        <button className={styles.btn} type="submit">
          Save the quiz
        </button>
      </div>
    </form>
  );
}
