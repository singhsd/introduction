import React, { useState } from 'react';
import { Textarea } from 'baseui/textarea';
import { Button, SIZE } from 'baseui/button';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';

export const Socials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const socialNetworks = [
    'Facebook',
    'Instagram',
    'LinkedIn',
    'Snapchat',
    'WhatsApp',
    'Discord',
    'Twitch',
  ];

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <Textarea
        value={_monologue}
        readOnly
        size={SIZE.large}
        overrides={{
          Input: {
            style: { height: '200px', width: '60%', margin: '0 auto', textAlign: 'center' },
          },
        }}
      />
      <br />
      <Button onClick={openModal} overrides={{ BaseButton: { style: { padding: '5px' } } }}>
        Open Handles
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Handles</ModalHeader>
        <ModalBody>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '5px',
            maxWidth: '500px', // Adjust the max width as needed
            margin: '0 auto',
          }}
          >
            {socialNetworks.map((network, index) => (
              <Button key={index} kind="secondary" style={{ marginBottom: '5px', flexBasis: '100%' }}>
                {network}
              </Button>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={closeModal}>Close</ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const _monologue =
  "This part is just to help you stalk me. Most of these accounts would be private, and for some of these, there would be no contact information, for privacy and security. Honestly, this is just for me to keep track of my profiles more than anything else.";
