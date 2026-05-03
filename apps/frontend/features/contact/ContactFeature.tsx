import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PolicyHeader } from '@/components/PrivacyPolicy/PolicyHeader';
import { PolicyBackLink } from '@/components/PrivacyPolicy/PolicyBackLink';
import { ContactInfoCard } from '@/components/Contact/ContactInfoCard';
import { ContactMapPlaceholder } from '@/components/Contact/ContactMapPlaceholder';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { getTranslator } from '@/lib/i18n/locale';

export async function ContactFeature() {
  const t = await getTranslator();
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader title={t('contactPageTitle')} subtitle={t('contactPageSubtitle')} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <ContactInfoCard
          icon={<EmailIcon />}
          title={t('contactEmailTitle')}
          primaryText={t('contactEmailPrimary')}
          secondaryText={t('contactEmailSecondary')}
        />
        <ContactInfoCard
          icon={<PhoneIcon />}
          title={t('contactPhoneTitle')}
          primaryText={t('contactPhonePrimary')}
          secondaryText={t('contactPhoneSecondary')}
        />
        <ContactInfoCard
          icon={<LocationOnIcon />}
          title={t('contactAddressTitle')}
          primaryText={t('contactAddressPrimary')}
          secondaryText={t('contactAddressSecondary')}
        />
        <ContactInfoCard
          icon={<AccessTimeIcon />}
          title={t('contactHoursTitle')}
          primaryText={t('contactHoursPrimary')}
          secondaryText={t('contactHoursSecondary')}
        />
        <ContactInfoCard
          icon={<SupportAgentIcon />}
          title={t('contactOrdersTitle')}
          primaryText={t('contactOrdersPrimary')}
          secondaryText={t('contactOrdersSecondary')}
        />
        <ContactInfoCard
          icon={<HeadsetMicIcon />}
          title={t('contactTechTitle')}
          primaryText={t('contactTechPrimary')}
          secondaryText={t('contactTechSecondary')}
        />
      </Box>

      <ContactMapPlaceholder
        address={t('contactAddressPrimary')}
        caption={t('contactMapCaption')}
      />

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('contactCompanyInfo')}
        </Typography>
      </Box>
    </Container>
  );
}
