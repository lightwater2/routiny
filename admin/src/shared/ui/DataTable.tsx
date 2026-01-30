import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = '데이터가 없습니다.',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white py-16 text-center text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-xs font-semibold text-gray-500"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="border-b border-gray-50 hover:bg-gray-50/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
