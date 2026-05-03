import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { PolicySection } from './PolicySection';
import { PolicyHeader } from './PolicyHeader';
import { PolicyBackLink } from './PolicyBackLink';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';

const LOCALE_BCP47: Record<string, string> = {
  it: 'it-IT',
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
};

export async function PrivacyPolicyContent() {
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
        title={t('privacyPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${lastUpdated}`}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <PolicySection title={t('privacyS1Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS1Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS2Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('privacyS2Intro')}
          </Typography>
          <List component="ul" sx={{ pl: 2, listStyleType: 'disc', color: 'text.secondary' }}>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">
                <strong>{t('privacyS2Item1Label')}</strong> {t('privacyS2Item1Desc')}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">
                <strong>{t('privacyS2Item2Label')}</strong> {t('privacyS2Item2Desc')}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">
                <strong>{t('privacyS2Item3Label')}</strong> {t('privacyS2Item3Desc')}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">
                <strong>{t('privacyS2Item4Label')}</strong> {t('privacyS2Item4Desc')}
              </Typography>
            </ListItem>
          </List>
        </PolicySection>

        <PolicySection title={t('privacyS3Title')}>
          <List component="ul" sx={{ pl: 2, listStyleType: 'disc', color: 'text.secondary' }}>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS3Item1')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS3Item2')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS3Item3')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS3Item4')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS3Item5')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS3Item6')}</Typography>
            </ListItem>
          </List>
        </PolicySection>

        <PolicySection title={t('privacyS4Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS4Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS5Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS5Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS6Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('privacyS6Intro')}
          </Typography>
          <List component="ul" sx={{ pl: 2, listStyleType: 'disc', color: 'text.secondary' }}>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS6Item1')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS6Item2')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS6Item3')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS6Item4')}</Typography>
            </ListItem>
          </List>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {t('privacyS6Closing')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS7Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('privacyS7Intro')}
          </Typography>
          <List component="ul" sx={{ pl: 2, listStyleType: 'disc', color: 'text.secondary' }}>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS7Item1')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS7Item2')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS7Item3')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS7Item4')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS7Item5')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS7Item6')}</Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0.5 }} disableGutters>
              <Typography variant="body1">{t('privacyS7Item7')}</Typography>
            </ListItem>
          </List>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {t('privacyS7Closing')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS8Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS8Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS9Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS9Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS10Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS10Body')}
          </Typography>
        </PolicySection>
      </Box>
    </Container>
  );
}
