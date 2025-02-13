import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className='ml-72 flex items-center justify-center'>
      <div className="flex justify-center flex-col items-center px-4 my-24 mx-auto">
      <h1 className="flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-700 dark:from-slate-300 dark:to-slate-500 py-6 mb-12 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-6xl">
        {t('titleAbout')}
      </h1>
      <div className="text-neutral-500 dark:text-gray text-2xl max-w-5xl mx-auto mb-10">
        {t('paragraph1About')} {" "}
        <p className="font-bold mt-4">
        {t('paragraph2About')}
        </p>
        <p className='mt-4'>
        {t('paragraph3About')}
        </p>
      </div>
      <div className="text-neutral-500 dark:text-gray text-2xl max-w-5xl mx-auto mt-4">
      {t('paragraph4About')}
        <p className='mt-4 font-bold'>
        {t('paragraph5About')}
        </p>
      </div>
    </div>
    </div>
  )
}

export default About