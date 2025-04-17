import { Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';

const GeneralView = () => {
  const { t } = useTranslation();

  return <Typography variant="body1"> {t('generalSettings')} </Typography>;
};

export default GeneralView;
