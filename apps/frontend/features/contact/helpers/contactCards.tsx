import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import type { ReactNode } from 'react';
import type { TranslationKey } from '@/lib/i18n/translator';

type ContactCardDefinition = {
  readonly id: string;
  readonly icon: ReactNode;
  readonly titleKey: TranslationKey;
  readonly primaryKey: TranslationKey;
  readonly secondaryKey: TranslationKey;
};

export const contactCards: readonly ContactCardDefinition[] = [
  {
    id: 'email',
    icon: <EmailIcon />,
    titleKey: 'contactEmailTitle',
    primaryKey: 'contactEmailPrimary',
    secondaryKey: 'contactEmailSecondary',
  },
  {
    id: 'phone',
    icon: <PhoneIcon />,
    titleKey: 'contactPhoneTitle',
    primaryKey: 'contactPhonePrimary',
    secondaryKey: 'contactPhoneSecondary',
  },
  {
    id: 'address',
    icon: <LocationOnIcon />,
    titleKey: 'contactAddressTitle',
    primaryKey: 'contactAddressPrimary',
    secondaryKey: 'contactAddressSecondary',
  },
  {
    id: 'hours',
    icon: <AccessTimeIcon />,
    titleKey: 'contactHoursTitle',
    primaryKey: 'contactHoursPrimary',
    secondaryKey: 'contactHoursSecondary',
  },
  {
    id: 'orders',
    icon: <SupportAgentIcon />,
    titleKey: 'contactOrdersTitle',
    primaryKey: 'contactOrdersPrimary',
    secondaryKey: 'contactOrdersSecondary',
  },
  {
    id: 'tech',
    icon: <HeadsetMicIcon />,
    titleKey: 'contactTechTitle',
    primaryKey: 'contactTechPrimary',
    secondaryKey: 'contactTechSecondary',
  },
];
