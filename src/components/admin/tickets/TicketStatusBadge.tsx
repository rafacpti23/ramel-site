
interface TicketStatusBadgeProps {
  status: string;
}

export const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => {
  return (
    <span className={`px-2 py-1 rounded text-xs ${
      status === 'aberto' 
        ? 'bg-blue-500/20 text-blue-300' 
        : status === 'respondido'
        ? 'bg-green-500/20 text-green-300'
        : 'bg-gray-500/20 text-gray-300'
    }`}>
      {status === 'aberto' ? 'Aberto' : 
       status === 'respondido' ? 'Respondido' : 'Fechado'}
    </span>
  );
};
