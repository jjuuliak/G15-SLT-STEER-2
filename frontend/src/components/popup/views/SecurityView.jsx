import { Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';

const SecurityView = () => {
    const { t } = useTranslation();

    return ( 
        <Typography variant="body1"> {t('securitySettings')} </Typography>
     );
}
 
export default SecurityView;