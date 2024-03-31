import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import useCards from "@/hooks/useCards";
import { deleteList} from "@/utils/client";
import type { CardProps } from "./Card";
import EditListDialog from "./EditListDialog";
import { useTheme } from '@mui/material/styles';

export type CardListProps = {
  id: string;
  name: string;
  description: string;
  cards: CardProps[];
  deleting: boolean;
  file: string;
};

export default function CardList({ id, name, description, cards, file, deleting}: CardListProps) {
  // console.log("infor:",id, name, description, cards, file, deleting)
  const { fetchLists } = useCards();
  const theme = useTheme();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };
  const handleDelete = async () => {
    try {
      await deleteList(id);
      await fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };
{/* <img src={file} alt="List Cover" /> */}

  
  return (
    <>
      <Paper className="w-50 p-0" elevation={0} sx={{ position: 'relative', background: theme.palette.primary.main, margin:'15px', borderRadius: '30px'}} onClick={handleEditClick}>
      <img
      src={file}
      alt="Front Cover"
      style={{ borderRadius: '30px' , maxWidth:'230px', maxHeight:'230px', width:'230px', height:'230px'}}
    />

        {deleting ? (
          <div
            className="grid place-items-center"
            style={{ position: 'absolute', top: '4px', right: '4px' }}
          >
            <IconButton color="error" onClick={() => {handleDelete(); }}>
              <DeleteIcon />
            </IconButton>
          </div>
        ) : (
          <></>
        )}
        <div className="text-center"> {/* Added a div container for the text content */}
          <div style={{color: theme.palette.primary.dark}}> {/* Apply the desired color to cards.length */}
              {cards.length <= 1 ? `${cards.length} song` : `${cards.length} songs`}
          </div>
          {name}
        </div>

      </Paper>
      
      <EditListDialog
          open={isEditDialogOpen && !deleting}
          onClose={() => setIsEditDialogOpen(false)}
          id={id}
          title={name}
          description={description}
          cards={cards}
          file={file}
      />
    </>
  );
  
}
