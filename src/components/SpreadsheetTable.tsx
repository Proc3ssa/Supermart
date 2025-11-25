import { useState } from "react";
import { SpreadsheetRow } from "@/types/spreadsheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Plus } from "lucide-react";

interface SpreadsheetTableProps {
  rows: SpreadsheetRow[];
  onAddRow: (row: Omit<SpreadsheetRow, "id" | "balance">) => void;
  onUpdateRow: (rowId: string, updates: Partial<SpreadsheetRow>) => void;
  onDeleteRow: (rowId: string) => void;
  // ADDED: Prop to disable deletion of the first row (the Open Balance row)
  disableFirstRowDeletion: boolean;
}

export const SpreadsheetTable = ({ rows, onAddRow, onUpdateRow, onDeleteRow, disableFirstRowDeletion }: SpreadsheetTableProps) => {
  const [newRow, setNewRow] = useState({
    date: "",
    description: "",
    quantityIn: 0,
    quantityOut: 0,
    deliveryDate: "",
    driver: "",
  });
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const handleAddRow = () => {
    if (newRow.description.trim()) {
      onAddRow(newRow);
      setNewRow({
        date: "",
        description: "",
        quantityIn: 0,
        quantityOut: 0,
        deliveryDate: "",
        driver: "",
      });
    }
  };

  const confirmDeleteRow = () => {
    if (!rowToDelete) return;
    onDeleteRow(rowToDelete);
    setRowToDelete(null);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-table-header border-b border-table-border">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Qty In</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Qty Out</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Balance</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Delivery Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Driver</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              // Check if deletion should be disabled for this row
              const isDeleteDisabled = disableFirstRowDeletion && index === 0;

              return (
                <tr key={row.id} className="border-b border-table-border hover:bg-table-hover transition-colors">
                  <td className="px-4 py-3">
                    <Input
                      type="date"
                      value={row.date}
                      onChange={(e) => onUpdateRow(row.id, { date: e.target.value })}
                      className="h-8 text-sm"
                      // Disable date input for Open Balance row
                      disabled={index === 0 && row.description === "Open Balance"} 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={row.description}
                      onChange={(e) => onUpdateRow(row.id, { description: e.target.value })}
                      className="h-8 text-sm"
                      // Disable description input for Open Balance row
                      disabled={index === 0 && row.description === "Open Balance"} 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={row.quantityIn}
                      onChange={(e) => onUpdateRow(row.id, { quantityIn: Number(e.target.value) })}
                      className="h-8 text-sm w-24"
                      // Allow Qty In update only for Open Balance row
                      disabled={index !== 0 && row.description === "Open Balance"} 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={row.quantityOut}
                      onChange={(e) => onUpdateRow(row.id, { quantityOut: Number(e.target.value) })}
                      className="h-8 text-sm w-24"
                      // Disable Qty Out input for Open Balance row
                      disabled={index === 0 && row.description === "Open Balance"} 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{row.balance}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="date"
                      value={row.deliveryDate}
                      onChange={(e) => onUpdateRow(row.id, { deliveryDate: e.target.value })}
                      className="h-8 text-sm"
                      // Disable input for Open Balance row
                      disabled={index === 0 && row.description === "Open Balance"} 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={row.driver}
                      onChange={(e) => onUpdateRow(row.id, { driver: e.target.value })}
                      className="h-8 text-sm"
                      // Disable input for Open Balance row
                      disabled={index === 0 && row.description === "Open Balance"} 
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => isDeleteDisabled ? null : setRowToDelete(row.id)}
                      className={`h-8 w-8 text-muted-foreground ${isDeleteDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-destructive'}`}
                      disabled={isDeleteDisabled}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-muted/50">
              <td className="px-4 py-3">
                <Input
                  type="date"
                  value={newRow.date}
                  onChange={(e) => setNewRow({ ...newRow, date: e.target.value })}
                  className="h-8 text-sm"
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  value={newRow.description}
                  onChange={(e) => setNewRow({ ...newRow, description: e.target.value })}
                  placeholder="Description..."
                  className="h-8 text-sm"
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  type="number"
                  value={newRow.quantityIn}
                  onChange={(e) => setNewRow({ ...newRow, quantityIn: Number(e.target.value) })}
                  className="h-8 text-sm w-24"
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  type="number"
                  value={newRow.quantityOut}
                  onChange={(e) => setNewRow({ ...newRow, quantityOut: Number(e.target.value) })}
                  className="h-8 text-sm w-24"
                />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {newRow.quantityIn - newRow.quantityOut}
                </span>
              </td>
              <td className="px-4 py-3">
                <Input
                  type="date"
                  value={newRow.deliveryDate}
                  onChange={(e) => setNewRow({ ...newRow, deliveryDate: e.target.value })}
                  className="h-8 text-sm"
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  value={newRow.driver}
                  onChange={(e) => setNewRow({ ...newRow, driver: e.target.value })}
                  placeholder="Driver..."
                  className="h-8 text-sm"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <Button
                  size="icon"
                  onClick={handleAddRow}
                  className="h-8 w-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!rowToDelete} onOpenChange={(open) => !open && setRowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Row</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this row? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRow}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};