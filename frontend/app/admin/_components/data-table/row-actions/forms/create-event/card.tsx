"use client"
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreateEventForm } from "./form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";

export default function CreateEventButton() {
  const [isDialogOpenCreate, setIsDialogOpenCreate] = useState<boolean>(false);
  const openDialogCreate = () => setIsDialogOpenCreate(true);
  const closeDialogCreate = () => setIsDialogOpenCreate(false);

  return (
    <div className="container max-w-4xl py-8">
      <DropdownMenu 
      open={isDialogOpenCreate}
      onOpenChange={(open: boolean) => {
        setIsDialogOpenCreate(open);
      }}>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={openDialogCreate}

          className="bg-green-500 font-bold hover:bg-green-600 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={"right"}
          align="end"
          sideOffset={4}
          className="w-96"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Create New event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CreateEventForm close={closeDialogCreate} />
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}