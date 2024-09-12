import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

export default function Dialog({ isOpen, onOpenChange, onSubmit, title, content }) {
    function handleButtonClick(onClose) {
        onSubmit();
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
                            <Button color="primary" onClick={ () => handleButtonClick(onClose) }>
                                Confirm
                            </Button>
                        </ModalFooter>
                    </>
                ) }
            </ModalContent>
        </Modal>
    );
}
