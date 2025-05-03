
interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Carregando..." }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-ramel animate-spin" />
      <p className="mt-4">{message}</p>
    </div>
  );
};
