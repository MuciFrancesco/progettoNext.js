import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PolicyHeader } from '@/components/PrivacyPolicy/PolicyHeader/PolicyHeader';
import { PolicyBackLink } from '@/components/PrivacyPolicy/PolicyBackLink/PolicyBackLink';
import { ContactInfoCard } from '@/components/Contact/ContactInfoCard/ContactInfoCard';
import { ContactMapPlaceholder } from '@/components/Contact/ContactMapPlaceholder/ContactMapPlaceholder';
import { contactCards } from '@/features/contact/helpers/contactCards';
import { getTranslator } from '@/lib/i18n/locale';
import styles from './ContactFeature.module.scss';

export async function ContactFeature() {
  const t = await getTranslator();
  return (
    <Container maxWidth="md" className={styles.page}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader title={t('contactPageTitle')} subtitle={t('contactPageSubtitle')} />

      <Box className={styles.cardsGrid}>
        {contactCards.map((card) => (
          <ContactInfoCard
            key={card.id}
            icon={card.icon}
            title={t(card.titleKey)}
            primaryText={t(card.primaryKey)}
            secondaryText={t(card.secondaryKey)}
          />
        ))}
      </Box>

      <ContactMapPlaceholder
        address={t('contactAddressPrimary')}
        caption={t('contactMapCaption')}
      />

      <Box className={styles.companyInfo}>
        <Typography variant="body2" color="text.secondary">
          {t('contactCompanyInfo')}
        </Typography>
      </Box>
    </Container>
  );
}
