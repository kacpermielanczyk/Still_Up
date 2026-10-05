type BrandProps = {
  compact?: boolean;
};

export default function Brand({ compact = false }: BrandProps) {
  return (
    <div className="flex items-center gap-2.5 font-extrabold text-foreground">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="EYE"
            transform="translate(500 500) scale(1.35) translate(-500 -500)"
          >
            <path
              d="M263.932,453.298C421.415,294.038 578.898,295.503 736.381,453.868"
              fill="none"
              stroke="currentColor"
              strokeWidth="40.83"
            />

            <path
              d="M263.932,547.332C421.415,728.503 578.898,729.379 736.381,547.332"
              fill="none"
              stroke="currentColor"
              strokeWidth="40.83"
            />

            <g transform="matrix(1,0,0,1,-29.221723,-39.89314)">
              <path
                d="M410.513,542.326C413.285,479.196 465.413,428.792 529.222,428.792C592.106,428.792 643.647,477.747 647.779,539.592L583.011,539.592C579.829,539.592 576.823,541.046 574.847,543.539L548.407,576.903L520.976,493.444C519.679,489.499 516.164,486.701 512.029,486.323C507.894,485.944 503.93,488.058 501.939,491.701L474.277,542.326L410.513,542.326ZM647.363,560.426C640.966,619.992 590.476,666.441 529.222,666.441C468.908,666.441 419.03,621.408 411.406,563.16L480.456,563.16C484.265,563.16 487.77,561.081 489.597,557.738L508.692,522.791L534.657,601.79C535.853,605.431 538.953,608.121 542.726,608.793C546.499,609.465 550.336,608.011 552.716,605.007L588.047,560.426L647.363,560.426Z"
                fill="currentColor"
              />
            </g>
          </g>
        </svg>
      </span>

      {!compact && <span className="text-xl tracking-tight">StillUp</span>}
    </div>
  );
}
