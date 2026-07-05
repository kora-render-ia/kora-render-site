interface PropriedadesIconeBandeira {
  tamanho?: number;
  className?: string;
}

export function BandeiraBrasil({ tamanho = 18, className }: PropriedadesIconeBandeira) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="Português (Brasil)"
    >
      <clipPath id="corte-brasil">
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath="url(#corte-brasil)">
        <rect width="24" height="24" fill="#009c3b" />
        <path d="M12 3.5 21.5 12 12 20.5 2.5 12z" fill="#ffdf00" />
        <circle cx="12" cy="12" r="4.6" fill="#002776" />
        <path d="M7.6 10.3a7.4 7.4 0 0 1 9 1.6 7.4 7.4 0 0 0-9-1.6z" fill="#fff" />
      </g>
    </svg>
  );
}

export function BandeiraEUA({ tamanho = 18, className }: PropriedadesIconeBandeira) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="English"
    >
      <clipPath id="corte-eua">
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath="url(#corte-eua)">
        <rect width="24" height="24" fill="#fff" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} y={i * (24 / 13) * 2} width="24" height={24 / 13} fill="#b22234" />
        ))}
        <rect width="12" height="10.6" fill="#3c3b6e" />
      </g>
    </svg>
  );
}
