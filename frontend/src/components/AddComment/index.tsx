import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import styles from './AddComment.module.scss';
import axios from '../../axios';

export const Index = () => {
  const [text, setText] = useState('');
  const params = useParams();

  const postComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      idPost: params.id,
      text: text,
    };

    axios
      .post('/api/comment', data)
      .then((e) => console.log(e))
      .then((e) => console.log(e));

    setText('');
  };
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src="https://mui.com/static/images/avatar/5.jpg"
        />
        <form onSubmit={postComment} className={styles.form}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button type="submit" variant="contained">
            Отправить
          </Button>
        </form>
      </div>
    </>
  );
};
