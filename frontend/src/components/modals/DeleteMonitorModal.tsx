import type { Monitor as MonitorType } from "@/types";

import Modal from "./Modal";
import { useNavigate } from "react-router";
import DeleteMonitorForm from "../forms/monitors/DeleteMonitorForm";

type DeleteMonitorModalProps = {
  open: boolean;
  monitor: MonitorType | null;
  onClose: () => void;
  navigateAfterDelete?: boolean;
};

export default function DeleteMonitorModal({
  open,
  monitor,
  onClose,
  navigateAfterDelete = false,
}: DeleteMonitorModalProps) {
  const navigate = useNavigate();

  if (!monitor) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Delete monitor"
      description="This action permanently removes the monitor and its related history."
    >
      <DeleteMonitorForm
        monitor={monitor}
        onClose={onClose}
        onDeleted={
          navigateAfterDelete
            ? () =>
                navigate("/monitors", {
                  replace: true,
                })
            : undefined
        }
      />
    </Modal>
  );
}
