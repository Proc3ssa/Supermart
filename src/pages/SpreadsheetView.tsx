import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item, SpreadsheetRow } from "@/types/spreadsheet";
import { loadItems, addSheet, deleteSheet, addRow, updateRow, deleteRow } from "@/lib/storage";
import { SpreadsheetTable } from "@/components/SpreadsheetTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";

const SpreadsheetView = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [activeSheet, setActiveSheet] = useState<string>("");

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

  const handleDeleteSheet = (sheetId: string) => {
    if (!itemId || !item) return;
    if (item.sheets.length <= 1) {
      toast.error("Cannot delete the last sheet");
      return;
    }
    deleteSheet(itemId, sheetId);
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
      if (activeSheet === sheetId) {
        setActiveSheet(updatedItem.sheets[0].id);
      }
      toast.success("Sheet deleted");
    }
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
    updateRow(itemId, activeSheet, rowId, updates);
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
    }
  };

  const handleDeleteRow = (rowId: string) => {
    if (!itemId || !activeSheet) return;
    deleteRow(itemId, activeSheet, rowId);
    const items = loadItems();
    const updatedItem = items.find((i) => i.id === itemId);
    if (updatedItem) {
      setItem(updatedItem);
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
                  <TabsTrigger value={sheet.id} className="pr-8">
                    {sheet.name}
                  </TabsTrigger>
                  {item.sheets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSheet(sheet.id);
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
          </div>

          {currentSheet && (
            <TabsContent value={activeSheet}>
              <SpreadsheetTable
                rows={currentSheet.rows}
                onAddRow={handleAddRow}
                onUpdateRow={handleUpdateRow}
                onDeleteRow={handleDeleteRow}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SpreadsheetView;
