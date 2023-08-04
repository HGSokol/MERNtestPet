import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { SimpleMdeReact, SimpleMDEReactProps } from 'react-simplemde-editor';
import { useForm } from 'react-hook-form';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { dataType, FormCreatePostValues } from '../../@types/appTypes';
import axios from '../../axios';

export const AddPost = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<FormCreatePostValues>({
    defaultValues: {
      title: '',
      tags: '',
    },
    mode: 'onChange',
  });
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = React.useState('');
  const [text, setText] = React.useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmitForm = async (value: FormCreatePostValues) => {
    try {
      const { title, tags } = value;

      const data: dataType = {
        title,
        text,
      };

      if (tags)
        data.tags = tags
          .replace(/[;, ]/g, ' ')
          .split(' ')
          .filter((e) => e !== '');
      if (imageUrl && imageUrl.length > 0) data.imageUrl = imageUrl;

      const post = await axios.post('/api/posts', data);
      const { _id } = post.data;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.log('ошибка создания поста');
    }
  };

  const handleChangeFile = async (e: any) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('image', file);

    const { data } = await axios.post('/api/upload', formData);

    setImageUrl(data.url);
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
    inputRef.current!.value = '';
  };

  const onChange = React.useCallback((value: string) => {
    setText(value);
  }, []);

  const options: SimpleMDEReactProps = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  return (
    <Paper style={{ padding: 30 }}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Button
          onClick={() => inputRef.current?.click()}
          variant="outlined"
          size="large"
        >
          Загрузить превью
        </Button>
        <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
        {imageUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
            >
              Удалить
            </Button>
            <img
              className={styles.image}
              src={`http://localhost:3001${imageUrl}`}
              alt="Uploaded"
            />
          </>
        )}
        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Заголовок статьи..."
          {...register('title', {
            required: 'Укажите Заголовок',
          })}
          fullWidth
        />
        <TextField
          classes={{ root: styles.tags }}
          variant="standard"
          placeholder="Введите тэги через пробелы"
          {...register('tags')}
          fullWidth
        />
        <SimpleMdeReact
          className={styles.editor}
          value={text}
          onChange={onChange}
          options={options}
        />
        <div className={styles.buttons}>
          <Button
            disabled={!isValid || text === ''}
            type="submit"
            size="large"
            variant="contained"
          >
            Опубликовать
          </Button>
          <Link to="/">
            <Button size="large">Отмена</Button>
          </Link>
        </div>
      </form>
    </Paper>
  );
};
