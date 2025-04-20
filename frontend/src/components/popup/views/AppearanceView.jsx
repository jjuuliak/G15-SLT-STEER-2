
import { Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';

const AppearanceView = () => {
    const { t } = useTranslation();

    return <Typography variant="body1"> {t('appearanceSettings')} </Typography>;
}
 
export default AppearanceView;
