
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketActions } from "./TicketActions";
import type { Ticket } from "@/types/ticket";

interface TicketsTableProps {
  tickets: Ticket[];
  onUpdateStatus: (ticketId: string, newStatus: string) => Promise<void>;
  onDelete: (ticketId: string) => void;
}

export const TicketsTable = ({ tickets, onUpdateStatus, onDelete }: TicketsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nº</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>#{ticket.id.slice(0, 8)}</TableCell>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>
              {ticket.user_name || 'N/A'}
              <br />
              <span className="text-xs text-muted-foreground">
                {ticket.user_email}
                {ticket.user_whatsapp && (
                  <>
                    <br />
                    WhatsApp: {ticket.user_whatsapp}
                  </>
                )}
              </span>
            </TableCell>
            <TableCell>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell>
              <TicketStatusBadge status={ticket.status} />
            </TableCell>
            <TableCell className="text-right">
              <TicketActions
                ticketId={ticket.id}
                status={ticket.status}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
