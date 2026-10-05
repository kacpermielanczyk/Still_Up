import CreateMonitorForm from "../forms/monitors/CreateMonitorForm";
import Modal from "./Modal";

type CreateMonitorModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateMonitorModal({
  open,
  onClose,
}: CreateMonitorModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Add monitor"
      description="Create a new website or API monitor."
    >
      <CreateMonitorForm onClose={onClose} />
    </Modal>
  );
}
