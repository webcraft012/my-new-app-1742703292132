export const ImageSourceSelector: React.FC<ImageSourceSelectorProps> = ({
  onChange,
  defaultValue,
}) => {
  return <button>Replace Image</button>;
};

interface ImageSourceSelectorProps {
  defaultValue?: string | undefined;
  onChange?: (value: string) => void;
}
