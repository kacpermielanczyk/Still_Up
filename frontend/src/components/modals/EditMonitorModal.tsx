import type { Monitor as MonitorType } from "@/types";

import Modal from "./Modal";
import EditMonitorForm from "../forms/monitors/EditMonitorForm";

type EditMonitorModalProps = {
  open: boolean;
  monitor: MonitorType | null;
  onClose: () => void;
};

export default function EditMonitorModal({
  open,
  monitor,
  onClose,
}: EditMonitorModalProps) {
  if (!monitor) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Edit monitor"
      description={`Update monitoring settings for ${monitor.name}.`}
    >
      <EditMonitorForm monitor={monitor} onClose={onClose} />
    </Modal>
  );
}
