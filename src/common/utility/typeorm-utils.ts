// interface WhereClauseOptions {
//   alias: string;
//   columns: string[];
//   searchVariableName: string;
// }

// export const generateWhereString = ({
//   alias,
//   columns,
//   searchVariableName,
// }: WhereClauseOptions): string => {
//   const conditions = columns.map(
//     (column) => `${alias}.${column} ILIKE :${searchVariableName}`,
//   );

//   return `(${conditions.join(' OR ')})`;
// };

// * 2nd Version
interface WhereClauseOptions {
  alias: string;
  columns: Array<{ name: string; type: 'text' | 'numeric' }>;
  searchVariableName: string;
}

export const generateWhereString = ({
  alias,
  columns,
  searchVariableName,
}: WhereClauseOptions): string => {
  const conditions = columns.map(({ name, type }) => {
    const columnRef = name.includes('.') ? name : `${alias}.${name}`;

    return type === 'text'
      ? `${columnRef} ILIKE :${searchVariableName}`
      : `${columnRef}::text ILIKE :${searchVariableName}`;
  });

  return `(${conditions.join(' OR ')})`;
};
