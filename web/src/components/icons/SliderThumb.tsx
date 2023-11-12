import { Icon, IconProps } from ".";

export const SliderThumb = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 36 40" {...props}>
      <>
        <path
          d="M8 8L8 1.75501e-07L5.99251 0V1.9975L3.99501 1.9975L3.99501 3.99501H1.9975L1.9975 5.99251H1.755e-07L0 8L8 8Z"
          fill="#11ED83"
        />
        <rect y="8" width="8" height="24" fill="#11ED83" />
        <path
          d="M8 32L1.755e-07 32L0 34.0075L1.9975 34.0075L1.9975 36.005H3.99501V38.0025L5.99251 38.0025V40H8L8 32Z"
          fill="#11ED83"
        />
        <rect width="20" height="40" transform="translate(8)" fill="#11ED83" />
        <rect x="12" y="14" width="2" height="12" fill="#172217" />
        <rect x="17" y="14" width="2" height="12" fill="#172217" />
        <rect x="22" y="14" width="2" height="12" fill="#172217" />
        <path
          d="M28 8L36 8V5.99251L34.0025 5.99251V3.99501L32.005 3.99501V1.9975L30.0075 1.9975V0L28 8.77508e-08L28 8Z"
          fill="#11ED83"
        />
        <path d="M28 8H36V32H28V8Z" fill="#11ED83" />
        <path d="M28 32V40H30.0075V38.0025H32.005V36.005H34.0025V34.0075H36V32H28Z" fill="#11ED83" />
      </>
    </Icon>
  );
};
