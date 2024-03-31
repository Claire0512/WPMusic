import { useState } from "react";

import { Paper } from "@mui/material";

import CardDialog from "./CardDialog";

export type CardProps = {
  id: string;
  
  song: string;
  singer: string;
  link: string;
  listId: string;
};

export default function Card({ id, song, singer, link, listId }: CardProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <button onClick={handleClickOpen} className="text-start">
        <Paper className="flex w-full flex-col p-2" elevation={6}>
          {song}
        </Paper>
      </button>
      <CardDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        id={id}
        song={song}
        singer={singer}
        link={link}
        listId={listId}
        cardId={id}
      />
    </>
  );
}
