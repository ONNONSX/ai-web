import Script from 'next/script';

interface CoupangPartnersProps {
  productId: string;
}

const CoupangPartners: React.FC<CoupangPartnersProps> = ({ productId }) => {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNERS_ID;

  if (!partnerId || !productId) return null;

  return (
    <>
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="lazyOnload"
      />
      <Script id={`coupang-${productId}`} strategy="lazyOnload">
        {`
          new window.PartnersCoupang.G({
            id: ${partnerId},
            template: "carousel",
            trackingCode: "AF1234567",
            width: "100%",
            height: "auto",
            productId: "${productId}"
          });
        `}
      </Script>
    </>
  );
};

export default CoupangPartners; 