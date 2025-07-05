interface CoupangPartnersProps {
  href: string;  // 쿠팡 파트너스 링크
  width?: number | string;
  height?: number | string;
}

export function CoupangPartners({ href, width = '100%', height = 'auto' }: CoupangPartnersProps) {
  return (
    <div 
      style={{ 
        width, 
        height,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <iframe
        src={href}
        width="100%"
        height="100%"
        style={{
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block',
        }}
        referrerPolicy="unsafe-url"
      />
    </div>
  );
} 