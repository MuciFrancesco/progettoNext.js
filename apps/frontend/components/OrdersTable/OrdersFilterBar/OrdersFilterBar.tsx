import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { OrderFilter } from '@/types/api/order';
import type { FilterOption } from '@/features/admin/hooks/useAdminOrders';
import styles from './OrdersFilterBar.module.scss';

type OrdersFilterBarProps = {
  readonly filter: OrderFilter;
  readonly filterOptions: FilterOption[];
  readonly isPending: boolean;
  readonly onChange: (e: React.MouseEvent, value: OrderFilter | null) => void;
};

export function OrdersFilterBar({
  filter,
  filterOptions,
  isPending,
  onChange,
}: Readonly<OrdersFilterBarProps>) {
  return (
    <ToggleButtonGroup
      value={filter}
      exclusive
      onChange={onChange}
      size="small"
      className={styles.filterGroup}
    >
      {filterOptions.map((f) => (
        <ToggleButton key={f.value} value={f.value} disabled={isPending}>
          {f.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
