import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { PolicySection } from '../PrivacyPolicy/PolicySection';
import { PolicyHeader } from '../PrivacyPolicy/PolicyHeader';
import { PolicyBackLink } from '../PrivacyPolicy/PolicyBackLink';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';

const LOCALE_BCP47: Record<string, string> = {
  it: 'it-IT',
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
};

export async function TermsOfServiceContent() {
  const [t, locale] = await Promise.all([getTranslator(), getCurrentLocale()]);
  const lastUpdated = new Date().toLocaleDateString(LOCALE_BCP47[locale] ?? 'it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader
        title={t('termsPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${lastUpdated}`}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <PolicySection title={t('termsS1Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS1Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS2Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS2Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS3Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('termsS3Body')}
          </Typography>
          <List component="ul" sx={{ pl: 2, listStyleType: 'disc', color: 'text.secondary' }}>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS3Item1')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS3Item2')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS3Item3')}</Typography>
            </ListItem>
          </List>
        </PolicySection>
        <PolicySection title={t('termsS4Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS4Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS5Title')}>
          <List component="ol" sx={{ pl: 2, listStyleType: 'decimal', color: 'text.secondary' }}>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS5Item1')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS5Item2')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS5Item3')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS5Item4')}</Typography>
            </ListItem>
          </List>
        </PolicySection>
        <PolicySection title={t('termsS6Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS6Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS7Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS7Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS8Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('termsS8Body')}
          </Typography>
          <List component="ul" sx={{ pl: 2, listStyleType: 'disc', color: 'text.secondary' }}>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS8Item1')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS8Item2')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('termsS8Item3')}</Typography>
            </ListItem>
          </List>
        </PolicySection>
        <PolicySection title={t('termsS9Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS9Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS10Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS10Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS11Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS11Body')}
          </Typography>
        </PolicySection>
        <PolicySection title={t('termsS12Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS12Body')}
          </Typography>
        </PolicySection>
      </Box>
    </Container>
  );
}
