import { Flex, Button, Dialog, TextField, Text } from "@radix-ui/themes";
import { useState } from "react";

interface GradeSubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (point: number) => void;
}

export const GradeSubmissionDialog: React.FC<GradeSubmissionDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [point, setPoint] = useState<number>(0);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 300 }}>
        <Dialog.Title>Feladat pontozása</Dialog.Title>
        <Flex direction="column" gap="3" mt="3">
          <Text size="2">Add meg a hallgató pontszámát:</Text>
          <TextField.Root
            type="number"
            value={point}
            onChange={(e) => setPoint(Number(e.target.value))}
          />
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" onClick={onClose}>
            Mégse
          </Button>
          <Button onClick={() => onConfirm(point)}>Mentés</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
