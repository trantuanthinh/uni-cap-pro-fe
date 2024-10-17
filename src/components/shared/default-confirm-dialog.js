import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

export default function ConfirmDialog({ isOpen = true, onOpenChange = true, onSubmit = null, title, content }) {
    function handleConfirm(onClose) {
        onSubmit?.();
        onClose();
    }

    return (
        <Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="md" backdrop={ "opaque" } isDismissable={ false }>
            <ModalContent>
                { (onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{ title }</ModalHeader>

                        <ModalBody>{ content }</ModalBody>

                        <ModalFooter>
                            <Button color="danger" variant="light" onClick={ onClose }>
                                Close
                            </Button>

                            <Button auto color="primary" onClick={ () => handleConfirm(onClose) }>
                                { onSubmit ? "Confirm" : "Close" }
                            </Button>
                        </ModalFooter>
                    </>
                ) }
            </ModalContent>
        </Modal>
    );
}
