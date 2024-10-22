import * as React from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { ChatProps } from '../../models/chat';
import { chats } from './DummyData';

export default function MyProfile() {
  const [selectedChat, setSelectedChat] = React.useState(null); // 초기 값 null

  return (
      <Sheet
          sx={{
            flex: 1,
            width: '100%',
            mx: 'auto',
            pt: { xs: 'var(--Header-height)', md: 0 },
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'minmax(min-content, min(30%, 400px)) 1fr',
            },
          }}
      >
        <Sheet
            sx={{
              position: { xs: 'fixed', sm: 'sticky' },
              transform: {
                xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
                sm: 'none',
              },
              transition: 'transform 0.4s, width 0.4s',
              zIndex: 100,
              width: '100%',
            }}
        >
          <ChatsPane
              chats={chats}
              selectedChatId={selectedChat ? selectedChat.id : null} // selectedChat이 있을 때만 id 접근
              setSelectedChat={setSelectedChat}
          />
        </Sheet>

        {selectedChat ? ( // selectedChat이 있을 때만 MessagesPane 렌더링
            <MessagesPane chat={selectedChat} />
        ) : (

            <div style={{display:'flex', alignItems: 'center', flexDirection: 'row', justifyContent:'center', fontWeight: '600'}}>채팅을 선택하세요</div> // selectedChat이 없을 때 표시할 내용
        )}
      </Sheet>
  );
}