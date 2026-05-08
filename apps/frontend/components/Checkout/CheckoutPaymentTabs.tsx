'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import styles from './Checkout.module.scss';

type PaymentMethod = 'card' | 'paypal';

function PayPalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.5 7.5C19.5 10.8 17.1 13.5 13.5 13.5H11.1L10.2 18H7.5L9.9 6H15C17.7 6 19.5 7.5 19.5 7.5Z"
        fill="#009cde"
      />
      <path
        d="M8.4 15H6L8.1 4.5H13.2C16.2 4.5 18 6 18 8.4C18 11.7 15.6 13.5 12 13.5H9.9L8.4 15Z"
        fill="#003087"
      />
    </svg>
  );
}

type CheckoutPaymentTabsProps = {
  readonly selectedMethod: PaymentMethod;
  readonly cardTab: string;
  readonly paypalTab: string;
  readonly onMethodChange: (method: PaymentMethod) => void;
};

export function CheckoutPaymentTabs({
  selectedMethod,
  cardTab,
  paypalTab,
  onMethodChange,
}: Readonly<CheckoutPaymentTabsProps>) {
  return (
    <Tabs
      value={selectedMethod}
      onChange={(_e, v: PaymentMethod) => onMethodChange(v)}
      className={styles.tabs}
    >
      <Tab
        value="card"
        label={cardTab}
        icon={<CreditCardIcon className={styles.tabIcon} />}
        iconPosition="start"
        className={styles.tab}
      />
      <Tab
        value="paypal"
        label={paypalTab}
        icon={<PayPalIcon />}
        iconPosition="start"
        className={styles.tab}
      />
    </Tabs>
  );
}
