import Script from 'next/script';

interface GoogleAdsenseProps {
  slot: string;
}

const GoogleAdsense: React.FC<GoogleAdsenseProps> = ({ slot }) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  if (!clientId || !slot) return null;

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`ads-${slot}`} strategy="lazyOnload">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  );
};

export default GoogleAdsense; 