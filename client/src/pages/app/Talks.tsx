import { useNavigate } from 'react-router-dom';
import { ChannelListMessengerProps, useChatContext } from 'stream-chat-react';
import { Context, useAuth } from '../../api/auth-api';
import styles from './Talks.module.scss';

export function Talks({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate();
  const { logout } = useAuth() as Context;
  const { setActiveChannel, channel: activeChannel } = useChatContext();

  return (
    <div className={styles.talks}>
      <button
        onClick={() => navigate('/talks/new')}
        className={styles.talks_btn}
      >
        New Chat
      </button>
      <hr className={styles.hr} />
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map((channel) => {
            const isActive = channel === activeChannel;
            const extraClasses = isActive
              ? styles.talks_active
              : styles.talks_inactive;
            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}
                key={channel.id}
                className={[styles.talks_btn, extraClasses].join(' ')}
              >
                <div className="">{channel.data?.name || channel.id}</div>
              </button>
            );
          })
        : 'No Talks'}
      <hr className={[styles.hr, styles.hr_bottom].join(' ')} />
      <button
        onClick={() => logout.mutate()}
        className={styles.talks_btn}
        disabled={logout.isLoading}
      >
        Logout
      </button>
    </div>
  );
}
