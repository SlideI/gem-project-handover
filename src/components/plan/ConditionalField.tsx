interface ConditionalFieldProps {
  show: boolean;
  children: React.ReactNode;
}

export const ConditionalField = ({ show, children }: ConditionalFieldProps) => {
  if (!show) return null;
  return <>{children}</>;
};
