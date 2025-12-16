import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item, SpreadsheetRow } from "@/types/spreadsheet";
import { loadItems, addSheet, deleteSheet, renameSheet, addRow, updateRow, deleteRow } from "@/lib/storage";
import { SpreadsheetTable } from "@/components/SpreadsheetTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, X, Download } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV, exportToExcel } from "@/lib/export";

const SpreadsheetView = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [editingSheet, setEditingSheet] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [sheetToDelete, setSheetToDelete] = useState<string | null>(null);

  useEffect(() => {
    const items = loadItems();
    const foundItem = items.find((i) => i.id === itemId);
    if (foundItem) {
      setItem(foundItem);
      if (!activeSheet && foundItem.sheets.length > 0) {
        setActiveSheet(foundItem.sheets[0].id);
      }
    } else {
      navigate("/");
    }
  }, [itemId, navigate, activeSheet]);

  const handleAddSheet = () => {
    if (!itemId) return;
    const newSheet = addSheet(itemId);
    if (newSheet) {
      const items = loadItems();
      const updatedItem = items.find((i) => i.id === itemId);
      if (updatedItem) {
        setItem(updatedItem);
        setActiveSheet(newSheet.id);
        toast.success("Sheet added successfully");
      }
    }
  };

  const confirmDeleteSheet = () => {
    if (!itemId || !item || !sheetToDelete) return;
    if (item.sheets.length <= 1) {
      toast.error("Cannot delete the last sheet");
      setSheetToDelete(null);
      return;
    }
    deleteSheet(itemId, sheetToDelete);
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
      if (activeSheet === sheetToDelete) {
        setActiveSheet(updatedItem.sheets[0].id);
      }
      toast.success("Sheet deleted");
    }
    setSheetToDelete(null);
  };

  const handleRenameSheet = (sheetId: string, newName: string) => {
    if (!itemId || !newName.trim()) return;
    renameSheet(itemId, sheetId, newName.trim());
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
      toast.success("Sheet renamed");
    }
    setEditingSheet(null);
  };

  const handleAddRow = (rowData: Omit<SpreadsheetRow, "id" | "balance">) => {
    if (!itemId || !activeSheet) return;
    addRow(itemId, activeSheet, rowData);
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
    }
  };

  const handleUpdateRow = (rowId: string, updates: Partial<SpreadsheetRow>) => {
    if (!itemId || !activeSheet) return;
    
    // Check if the description is being changed for the Open Balance row
    if (rowId === "open-balance-row-id" && updates.description !== undefined && updates.description !== "Open Balance") {
      // Allow description change for the opening balance row
      // No toast error needed, just proceed with the update
    }
    
    // Proceed with the update for all fields, including date and quantityIn
    updateRow(itemId, activeSheet, rowId, updates);
    
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
    }
  };

  const handleDeleteRow = (rowId: string) => {
    if (!itemId || !activeSheet) return;
    // Prevent deleting the Open Balance row
    if (rowId === "open-balance-row-id") {
      toast.error("Cannot delete the Open Balance row.");
      return;
    }
    deleteRow(itemId, activeSheet, rowId);
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
    }
  };

  const handleExport = (format: "csv" | "excel") => {
    if (!currentSheet) return;
    
    try {
      if (format === "csv") {
        exportToCSV(currentSheet.rows, currentSheet.name);
      } else {
        exportToExcel(currentSheet.rows, currentSheet.name);
      }
      toast.success(`Exported to ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Export failed");
    }
  };

  if (!item) return null;

  const currentSheet = item.sheets.find((s) => s.id === activeSheet);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{item.name}</h1>
              <p className="text-sm text-muted-foreground">Inventory spreadsheet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeSheet} onValueChange={setActiveSheet}>
          <div className="flex items-center gap-2 mb-6">
            <TabsList>
              {item.sheets.map((sheet) => (
                <div key={sheet.id} className="relative group">
                  <TabsTrigger 
                    value={sheet.id} 
                    className="pr-8"
                    onDoubleClick={() => {
                      setEditingSheet(sheet.id);
                      setEditName(sheet.name);
                    }}
                  >
                    {editingSheet === sheet.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleRenameSheet(sheet.id, editName)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRenameSheet(sheet.id, editName);
                          } else if (e.key === "Escape") {
                            setEditingSheet(null);
                          }
                        }}
                        className="bg-background text-foreground px-2 py-1 rounded border border-border w-24"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      sheet.name
                    )}
                  </TabsTrigger>
                  {item.sheets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSheetToDelete(sheet.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </TabsList>
            <Button variant="outline" size="sm" onClick={handleAddSheet} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Sheet
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {currentSheet && (
            <TabsContent value={activeSheet}>
              <SpreadsheetTable
                rows={currentSheet.rows}
                onAddRow={handleAddRow}
                onUpdateRow={handleUpdateRow}
                onDeleteRow={handleDeleteRow}
                // We keep this to ensure the delete button is disabled
                disableFirstRowDeletion={true}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>

      <AlertDialog open={!!sheetToDelete} onOpenChange={(open) => !open && setSheetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sheet? All data in this sheet will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSheet}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        By <a href="tel:+233553226020" className="font-medium text-primary hover:underline" aria-label="Call ProcessorCodes">ProcessorCodes</a> &copy; 2025
      </p>
    </div>
  );
};

export default SpreadsheetView;