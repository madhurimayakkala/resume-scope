import Button from "@/components/ui/Button";

interface SampleDataButtonProps {
  onLoad: () => void;
}

export default function SampleDataButton({ onLoad }: SampleDataButtonProps) {
  return (
    <Button variant="secondary" size="sm" onClick={onLoad}>
      <span aria-hidden="true">↗</span>
      Try with sample data
    </Button>
  );
}
