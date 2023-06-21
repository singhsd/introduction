import React, { useState } from 'react';
import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import { Textarea } from 'baseui/textarea';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import { SendEmailUrl } from './constants.js';

export const NoteSender = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sender, setSender] = useState('');
  const [isSending, setIsSending] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSubject('');
    setBody('');
    setSender('');
  };

  const formatSubject = () => {
    let formattedSubject = subject;

    if (sender.trim() !== '') {
      formattedSubject += ` [From: ${sender}]`;
    }

    return formattedSubject;
  };

  const sendEmail = async () => {
    if (subject.trim() === '' || body.trim() === '') {
      console.error('Subject and body must be non-empty');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(SendEmailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: formatSubject(),
          body,
        }),
      });

      if (response.ok) {
        console.log('Message sent successfully');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('An error occurred while sending the message', error);
    } finally {
      setIsSending(false);
      closeModal();
    }
  };

  const sendEmailWithTimeout = async () => {
    sendEmail();

    // Set a timeout of 5 seconds to close the modal
    setTimeout(() => {
      closeModal();
    }, 5000);
  };

  return (
    <div>
      <Button onClick={openModal}>Send Note</Button>

      <Modal isOpen={modalIsOpen} onClose={closeModal} unstable_ModalBackdropScroll>
        <ModalHeader>Compose Note</ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '12px' }}>
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Textarea
              placeholder="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Input
              placeholder="Sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            onClick={sendEmailWithTimeout}
            isLoading={isSending}
            disabled={subject.trim() === '' || body.trim() === ''}
          >
            {isSending ? 'Sending...' : 'Send'}
          </ModalButton>
          <ModalButton onClick={closeModal}>Cancel</ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};
