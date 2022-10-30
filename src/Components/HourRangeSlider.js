import { Slider } from "antd";

export default function HourRangeSlider({ minMaxHours, value, onChange }) {
  const marks = {};
  marks[minMaxHours.min] = {
    label: minMaxHours.min,
  };
  marks[minMaxHours.max] = {
    label: minMaxHours.max,
  };

  return (
    <Slider
      value={value}
      onChange={onChange}
      range={{ draggableTrack: true }}
      min={minMaxHours.min}
      max={minMaxHours.max}
      marks={marks}
    />
  );
}
