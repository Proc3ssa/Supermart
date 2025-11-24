import { useState, useEffect } from "react";
import { Item } from "@/types/spreadsheet";
import { loadItems, addItem, deleteItem } from "@/lib/storage";
import { ItemCard } from "@/components/ItemCard";
import { AddItemDialog } from "@/components/AddItemDialog";
import { FileSpreadsheet } from "lucide-react";

const ItemsList = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const handleAddItem = (name: string) => {
    addItem(name);
    setItems(loadItems());
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
    setItems(loadItems());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">SuperMart</h1>
              <p className="text-muted-foreground">Manage your inventory items</p>
            </div>
          </div>
          <AddItemDialog onAdd={handleAddItem} />
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex w-20 h-20 rounded-full bg-muted items-center justify-center mb-4">
              <FileSpreadsheet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No items yet</h3>
            <p className="text-muted-foreground mb-6">Create your first item to get started</p>
            <AddItemDialog onAdd={handleAddItem} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
            ))}
          </div>
        )}
      </div>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        By <a href="tel:+233553226020" className="font-medium text-primary hover:underline" aria-label="Call ProcessorCodes">ProcessorCodes</a> &copy; 2025
      </p>
    </div>
  );
};

export default ItemsList;
