import { TableCell, TableSortLabel } from '@mui/material';

export default function SortCell({ field, orderBy, order, onSort, children, ...rest }) {
  return (
    <TableCell sortDirection={orderBy === field ? order : false} {...rest}>
      <TableSortLabel active={orderBy === field} direction={orderBy === field ? order : 'asc'} onClick={() => onSort(field)}>
        {children}
      </TableSortLabel>
    </TableCell>
  );
}
