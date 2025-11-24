import { Item } from "@/types/spreadsheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
}

export const ItemCard = ({ item, onDelete }: ItemCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 flex-1"
            onClick={() => navigate(`/item/${item.id}`)}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.sheets.length} sheet{item.sheets.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
