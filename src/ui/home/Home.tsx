import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className='flex items-center justify-center text-4xl ml-48'>{t('welcome')}</div>
  )
}

export default Home