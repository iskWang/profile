import React from 'react';

/**
 * Ruled table of the form. The first column is the row header.
 * Under 40rem each row stacks into a block that keeps its column labels.
 * @param {{
 *   caption: string,
 *   columns: Array<{ key: string, label: string, className?: string }>,
 *   rows: Array<{ id?: string, cells: Record<string, React.ReactNode>, attrs?: object }>,
 *   className?: string,
 * }} props
 */
export function Ledger({ caption, columns, rows, className = '' }) {
  return (
    <table className={`ledger ${className}`.trim()}>
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col" className={column.className}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id ?? index} id={row.id} {...row.attrs}>
            {columns.map((column, cellIndex) => {
              const Cell = cellIndex === 0 ? 'th' : 'td';
              return (
                <Cell
                  key={column.key}
                  scope={cellIndex === 0 ? 'row' : undefined}
                  className={column.className}
                  data-label={column.label}
                >
                  {row.cells[column.key]}
                </Cell>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
