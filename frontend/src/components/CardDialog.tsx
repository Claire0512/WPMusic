
import { useRef} from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import TextField from "@mui/material/TextField";
import useCards from "@/hooks/useCards";
import { createCard} from "@/utils/client";

type NewCardDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  listId: string;
};

type EditCardDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  listId: string;
  cardId: string;
  id:string;
  song: string;
  singer: string;
  link: string;
};

type CardDialogProps = NewCardDialogProps | EditCardDialogProps;

export default function CardDialog(props: CardDialogProps) {
  const { open, onClose, listId } = props;
  

  const songRef = useRef<HTMLInputElement>(null);
  const singerRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const {getListById} = useCards();
  const {fetchCards} = useCards();

  const handleClose = () => {
    onClose();
   
  };

  const handleSave = async () => {
    // Assuming rows are available in this component.
    // If not, consider passing them down as props or retrieving them in another way.
    
    const songValue = songRef.current?.value ?? "";
    const singerValue = singerRef.current?.value ?? "";
    const linkValue = linkRef.current?.value ?? "";
  
    if (!songValue.trim() || !singerValue.trim() || !linkValue.trim()) {
      alert('All fields are required.');
      return;
    }
    const list = getListById(listId);
    const isDuplicateSong = list?.cards.some(card => card.song.toLowerCase() === songValue.toLowerCase());
    
    if (isDuplicateSong) {
      alert('A song with this name already exists.');
      return;
    }
  
    try {
      await createCard({
        song: songValue,
        singer: singerValue,
        link: linkValue,
        list_id: listId,
      });
      await fetchCards();
    } catch (error) {
      alert("Error: Failed to create card");
    } finally {
      onClose();
    }
  };
  

  // const handleDelete = async () => {
  //   if (variant !== "edit") {
  //     return;
  //   }
  //   try {
  //     await deleteCard(props.cardId);
  //     fetchCards();
  //   } catch (error) {
  //     alert("Error: Failed to delete card");
  //   } finally {
  //     handleClose();
  //   }
  // };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a song</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={songRef}
          label="List Song"
          variant="outlined"
          // sx={{ mt: 2 }}
          autoFocus
        />
      </DialogContent>
      <DialogTitle>Add the singer</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={singerRef}
          label="List Singer"
          variant="outlined"
          // sx={{ mt: 2 }}
          autoFocus
        />
      </DialogContent>
      <DialogTitle>Add the link</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={linkRef}
          label="List Link"
          variant="outlined"
          // sx={{ mt: 2 }}
          autoFocus
        />
        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
