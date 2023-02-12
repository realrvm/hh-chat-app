import {
  ChannelList,
  Chat,
  LoadingIndicator,
  Channel,
  Window,
  ChannelHeader,
  MessageInput,
  MessageList,
} from 'stream-chat-react';

import { useAuth, Context } from '../../api/auth-api';
import { Talks } from './Talks';

type Props = {};

export default function App({}: Props) {
  const { user, streamChat } = useAuth() as Context;

  if (!user || !streamChat) return <LoadingIndicator />;

  return (
    <Chat client={streamChat}>
      <ChannelList
        filters={{ members: { $in: [user.id] } }}
        List={Talks}
        sendChannelsToList
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
