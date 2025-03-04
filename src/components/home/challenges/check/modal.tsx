import React from 'react';
import { Heading, VStack } from '@/components/ui';
import { ModalBody } from '@/components/ui/modal';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { ModalCloseButton, Modal } from '@/components/ui/modal';
import { ModalHeader } from '@/components/ui/modal';
import { ModalContent } from '@/components/ui/modal';
import { ModalBackdrop } from '@/components/ui/modal';
import { CheckInForm } from '@/components/home/challenges/check/form';

type CheckModalProps = {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
};

export default function CheckModal({
  isOpen,
  onClose,
  challengeId,
}: CheckModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="mb-4">
          <VStack space="xs">
            <Heading size="md" className="text-typography-950">
              New Check In
            </Heading>
          </VStack>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 group-[:hover]/modal-close-button:stroke-background-700"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <CheckInForm
            challengeId={challengeId}
            onSubmit={onClose}
            onClose={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
