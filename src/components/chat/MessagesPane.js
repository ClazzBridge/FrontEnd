import React, { useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import {useSocket} from "../../context/SocketContext";
import {useSelector} from "react-redux";

export default function MessagesPane(props) {
  const { chat } = props;
  const [chatMessages, setChatMessages] = useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = useState('');
  const {emitWithReconnect, onEvent, offEvent} = useSocket();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      console.log('message: ' + msg);
      setChatMessages(prevMessages => [...prevMessages, msg]);
    };

    onEvent('newMessages', handleNewMessage);

    return () => {
      offEvent('newMessages', handleNewMessage);
    };
  }, [onEvent, offEvent, chatMessages])


  return (
      <Sheet
          sx={{
            height: {xs: 'calc(100dvh - var(--Header-height))', md: '88dvh'},
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.level1',

          }}
      >
        <MessagesPaneHeader sender={chat.sender}/>
        <Box
            sx={{
              display: 'flex',
              flex: 1,
              minHeight: 0,
              px: 2,
              py: 3,
              overflowY: 'scroll',
              flexDirection: 'column-reverse',
              backgroundColor: '#f6f8fa',
            }}
        >
          <Stack spacing={2} sx={{justifyContent: 'flex-end'}}>
            {chatMessages.map((message, index) => {
              const isYou = String(message.sender) === String(user.id);
              return (
                  <Stack
                      key={index}
                      direction="row"
                      spacing={2}
                      sx={{flexDirection: isYou ? 'row-reverse' : 'row'}}
                  >
                    {!isYou && (
                        <AvatarWithStatus
                            online={message.sender.online}
                            src={message.sender.avatar}
                        />
                    )}
                    <ChatBubble
                        variant={isYou ? 'sent' : 'received'} {...message} />
                  </Stack>
              );
            })}
          </Stack>
        </Box>
        <MessageInput
            textAreaValue={textAreaValue}
            setTextAreaValue={setTextAreaValue}
            onSubmit={() => {
              emitWithReconnect('newMessage', {
                chatId: chat.id,
                content: textAreaValue,
              });

              setTextAreaValue('');
            }}
        />
      </Sheet>
  );
}