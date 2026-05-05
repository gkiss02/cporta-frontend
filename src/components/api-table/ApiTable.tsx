import { Table } from "@radix-ui/themes";
import HeaderCell from "./HeaderCell";
import { useNavigate } from "react-router-dom";

interface ApiTableProps<T> {
  columns: string[];
  data: T[];
  mapping: (keyof T)[];
}

const ApiTable = <T extends Record<string, any>>({
  columns,
  data,
  mapping,
}: ApiTableProps<T>) => {
  const navigate = useNavigate();

  return (
    <Table.Root
      variant="surface"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-small)",
      }}
    >
      <Table.Header style={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}>
        <Table.Row
          style={{ borderBottom: "1px solid rgba(229, 226, 225, 0.1)" }}
        >
          {columns.map((column) => (
            <HeaderCell name={column} />
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item, rowIndex) => (
          <Table.Row
            key={item._id || rowIndex}
            onClick={() => navigate(item._id)}
          >
            {mapping.map((key, colIndex) => (
              <Table.Cell key={colIndex}>{item[key] ?? "-"}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ApiTable;
