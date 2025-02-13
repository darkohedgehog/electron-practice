import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className='ml-72 mt-24 flex items-center justify-center'>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 max-w-7xl mx-auto pt-20 md:pt-40 relative overflow-hidden px-4 md:px-8">
      <div className="flex flex-col items-start gap-10">
        <h1 className="text-3xl md:text-4xl sm:text-2xl md:leading-relaxed max-w-5xl text-center lg:text-left tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-800 dark:via-white dark:to-white from-neutral-600 via-neutral-400 to-neutral-600">
       {t('titleHome')}
       <span className="uppercase text-3xl md:text-2xl gap-1 flex items-center justify-center lg:justify-start bg-gradient-to-br from-slate-400 to-slate-500 bg-clip-text text-center font-medium tracking-tight text-transparent">
        {t('spanHome')}
        </span>
        </h1>
        <p className="mt-2 md:mt-6 text-center lg:text-left md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl  relative z-10">
        {t('paragraphHome')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start w-full items-center">
          <div className="flex items-center gap-4 justify-start my-4 relative z-10">
          </div>
        </div>
      </div>
      <div>
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-3xl p-4 bg-neutral-100 dark:bg-neutral-900 shadow-[0px_0px_5px_1px_rgba(0,0,0,0.05)_inset] dark:shadow-[0px_0px_5px_1px_rgba(255,255,255,0.05)_inset]">
          <img
            src="/src/ui/assets/library-banner.jpg"
            alt="Srpski kulturni centar"
            width={1000}
            height={1000}
            className="rounded-2xl h-80 w-full object-center object-cover"
          />
        </div>
      </div>
    </div>
    </div>
  )
}

export default Home;