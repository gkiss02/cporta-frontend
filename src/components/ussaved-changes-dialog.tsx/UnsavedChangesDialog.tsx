import { Flex, Button, Dialog } from "@radix-ui/themes";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog.Root open={open}>
      <Dialog.Content
        style={{
          maxWidth: 450,
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-small)",
        }}
      >
        <Dialog.Title>
          <Flex
            gap="2"
            align="center"
            style={{ color: "var(--rt-color-error)" }}
          >
            <AlertTriangle size={20} />
            Nem mentett változtatások
          </Flex>
        </Dialog.Title>
        <Dialog.Description
          size="2"
          mb="4"
          style={{ color: "var(--text-secondary)", marginTop: "1rem" }}
        >
          Biztosan el akarsz navigálni? A kódon végzett változtatásaid nem
          lettek elmentve, és el fognak veszni.
        </Dialog.Description>

        <Flex gap="3" mt="5" justify="end">
          <Button
            variant="soft"
            color="gray"
            onClick={onCancel}
            style={{
              cursor: "pointer",
              border: "1px solid var(--border-color)",
            }}
          >
            Mégse
          </Button>
          <Button
            variant="solid"
            color="red"
            onClick={onConfirm}
            style={{
              cursor: "pointer",
              backgroundColor: "var(--rt-color-error)",
              border: "1px solid transparent",
            }}
          >
            Oldal elhagyása
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UnsavedChangesDialog;
