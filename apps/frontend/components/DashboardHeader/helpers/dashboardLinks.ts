import GridViewIcon from '@mui/icons-material/GridView';
import GroupIcon from '@mui/icons-material/Group';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import type { SvgIconComponent } from '@mui/icons-material';
import { AdminRoutes, UserRoutes } from '@/lib/routes';

export type DashboardLink = {
  readonly href: string;
  readonly label: string;
  readonly Icon?: SvgIconComponent;
};

type AdminLinksLabels = {
  readonly overview: string;
  readonly role: string;
  readonly addProduct: string;
  readonly updateProduct: string;
  readonly orders: string;
};

type UserLinksLabels = {
  readonly userArea: string;
  readonly purchaseHistory: string;
};

export function getAdminLinks(labels: AdminLinksLabels): DashboardLink[] {
  return [
    { href: AdminRoutes.DASHBOARD, label: labels.overview, Icon: GridViewIcon },
    { href: AdminRoutes.ROLE, label: labels.role, Icon: GroupIcon },
    { href: AdminRoutes.ADD_PRODUCT, label: labels.addProduct, Icon: AddBoxIcon },
    { href: AdminRoutes.UPDATE_PRODUCT, label: labels.updateProduct, Icon: EditNoteIcon },
    { href: AdminRoutes.ORDERS, label: labels.orders, Icon: ReceiptLongIcon },
  ];
}

export function getUserLinks(labels: UserLinksLabels): DashboardLink[] {
  return [
    { href: UserRoutes.USER_AREA, label: labels.userArea, Icon: PersonIcon },
    { href: UserRoutes.PURCHASE_HISTORY, label: labels.purchaseHistory, Icon: ShoppingBagIcon },
  ];
}
