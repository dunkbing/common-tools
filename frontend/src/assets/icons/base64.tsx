export type IconProps = {
  size?: number;
  color?: string;
};

const IconBase64 = ({ size = 40, color }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    x="0px"
    y="0px"
    width={size}
    height={size}
    fill={color}
  >
    <rect width="100%" height="100%" fill="black" />
    <text
      x="50%"
      y="50%"
      dominant-baseline="middle"
      text-anchor="middle"
      font-size="32"
      font-weight="bold"
      fill="white"
    >
      64
    </text>
  </svg>
);

export default IconBase64;
