import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { createNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import axios from 'axios';

type FormValues = {
  title: string;
  body: string;   
  tag: Note['tag'];
};

const Schema = Yup.object({
  title: Yup.string().min(3, 'Min 3').max(50, 'Max 50').required('Required'),
  body: Yup.string().max(500, 'Max 500'),
  tag: Yup.mixed<Note['tag']>().oneOf([
    'Todo', 'Work', 'Personal', 'Meeting', 'Shopping',
  ]).required('Required'),
});

export default function NoteForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: () => void;
}) {
  const initialValues: FormValues = { title: '', body: '', tag: 'Todo' };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
  try {
    await createNote(values);
    resetForm();
    onCreated?.();
    onClose();
  } catch (err: unknown) {
    let msg = 'Error';
    if (axios.isAxiosError(err)) {
      msg =
        (typeof err.response?.data === 'string' && err.response?.data) ||
        err.response?.statusText ||
        err.message;
    } else if (err instanceof Error) {
      msg = err.message;
    }
    alert(msg);
  } finally {
    setSubmitting(false);
  }
}}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
              <ErrorMessage name="title" />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="body">Content</label>
            <Field
              as="textarea"
              id="body"
              name="body"
              rows={8}
              className={css.textarea}
            />
           
              <ErrorMessage name="body" />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
              <ErrorMessage name="tag" />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || !isValid}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}