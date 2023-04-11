import { Icon, IconProps } from "../";

export const Weed = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect
          x="2"
          y="2.5"
          width="20"
          height="20"
          rx="1"
          fill="url(#pattern0)"
        />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_266" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_266"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAARUlEQVQ4EWNgGAUDHwKMyE6IKQ74D+LLqUmDhdvSp4LlcYmDFDGBVVJAsCDrhdn86NZTZGG4i9DFQYoodgGKTaOcAQoBAMg8DgrfxLwlAAAAAElFTkSuQmCC"
          />
        </defs>
      </>
    </Icon>
  );
};