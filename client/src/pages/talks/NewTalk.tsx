import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useRef } from 'react';
import { Button, Form } from '../../components/';
import { Input } from '../../components/';
import { Link } from '../../components/';
import Select, { CSSObjectWithLabel, SelectInstance } from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Context, useAuth } from '../../api/auth-api';

import styles from './NewTalk.module.scss';

export default function NewTalk() {
  const { streamChat, user } = useAuth() as Context &
    Required<Pick<Context, 'user'>>;
  const navigate = useNavigate();
  const createChannel = useMutation({
    mutationFn: ({
      name,
      memberIds,
      imageUrl,
    }: {
      name: string;
      memberIds: string[];
      imageUrl?: string;
    }) => {
      if (!streamChat) throw Error('Not connected');

      return streamChat
        .channel('messaging', crypto.randomUUID(), {
          name,
          image: imageUrl,
          members: [user.id, ...memberIds],
        })
        .create();
    },
    onSuccess() {
      navigate('/');
    },
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const memberIdsRef =
    useRef<SelectInstance<{ label: string; value: string }>>(null);

  const users = useQuery({
    queryKey: ['stream', 'users'],
    queryFn: () =>
      streamChat!.queryUsers({ id: { $ne: user.id } }, { name: 1 }),
    enabled: streamChat != null,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const name = nameRef.current?.value;
    const imageUrl = imageUrlRef.current?.value;
    const selectOptions = memberIdsRef.current?.getValue();
    if (!name || selectOptions == null || selectOptions.length === 0) {
      return;
    }

    createChannel.mutate({
      name,
      imageUrl,
      memberIds: selectOptions.map((option) => option.value),
    });
  }

  const selectStyles = {
    control: (provided: CSSObjectWithLabel) => ({
      ...provided,
      backgroundColor: 'hsl(249, 11%, 23%)',
      border: 'none',
      boxShadow: 'none',
    }),
    container: (provided: CSSObjectWithLabel) => ({
      ...provided,
      width: '100%',
    }),
    option: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'hsl(0, 0%, 100%)',
      backgroundColor: 'hsl(249, 11%, 23%)',
      '&:hover': {
        color: 'hsl(164, 57%, 55%)',
      },
    }),
    menuList: (provided: CSSObjectWithLabel) => ({
      ...provided,
      padding: 0,
    }),
  };

  return (
    <Form>
      <Form.Body>
        <h1 className={styles.talks_title}>New Talk</h1>
        <form onSubmit={handleSubmit} className={styles.talks_form}>
          <label htmlFor="name">Name</label>
          <Input id="name" required ref={nameRef} />
          <label htmlFor="members">Members</label>
          <Select
            ref={memberIdsRef}
            id="members"
            required
            isMulti
            className="react-select-container"
            classNamePrefix="react-select"
            styles={selectStyles}
            isLoading={users.isLoading}
            options={users.data?.users.map((user) => {
              return { value: user.id, label: user.name || user.id };
            })}
          />
          <Button
            disabled={createChannel.isLoading}
            type="submit"
            className={styles.talks_btn}
          >
            {createChannel.isLoading ? 'Loading..' : 'Create'}
          </Button>
        </form>
      </Form.Body>
      <Form.Bottom>
        <Link to="/">Back</Link>
      </Form.Bottom>
    </Form>
  );
}
