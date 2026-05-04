import { Table } from "@radix-ui/themes";

const HeaderCell: React.FC<{ name: string }> = (props) => {
  return (
    <Table.ColumnHeaderCell
      style={{
        color: "var(--text-secondary)",
        fontSize: "12px",
        textTransform: "uppercase",
      }}
    >
      {props.name}
    </Table.ColumnHeaderCell>
  );
};

export default HeaderCell;
