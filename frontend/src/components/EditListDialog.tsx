import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { updateList } from "@/utils/client";
import type { CardProps } from "./Card";
import CardDialog from "./CardDialog";
import type { GridRowId } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';


import useCards from "@/hooks/useCards";
import { useEffect, useState } from "react";
import { createCard, deleteCard, updateCard} from "@/utils/client";

import { useTheme } from '@mui/material/styles';
type EditListDialogProps = {
  open: boolean;
  onClose: () => void;
  id:string;
  title: string;
  description: string;
  file: string;
  cards: CardProps[];
};

type UpdateCardParams = {
  id:string;
  song: string;
  singer: string;
  link: string;
  list_id: string;
};
const columns: GridColDef[] = [
  { field: 'song', headerName: 'Song', width: 130, editable: true },
  { field: 'singer', headerName: 'Singer', width: 130, editable: true },
  { 
    field: 'link', 
    headerName: 'Link', 
    width: 160,
    editable: true,
    renderCell: (params: GridRenderCellParams) => (
      <a href={params.value as string} target="_blank" rel="noopener noreferrer">
        {params.value}
      </a>
    ),
  },
];


export default function EditListDialog({ open, onClose, id, title, description, file}: EditListDialogProps) {
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const { lists } = useCards();
  const currentList = lists.find(list => list.id === id);
  const [rows, setRows] = useState(currentList?.cards || []);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableDescription, setEditableDescription] = useState(description);
  const { fetchCards, fetchLists } = useCards();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showListSelector, setShowListSelector] = useState(false);
  // const [allLists, setAllLists] = useState([]);
  // const [editableFile, setEditableFile] = useState(title);
  const handleDeleteClick = () => {
    if (selectedRows.length > 0) {
      setDeleteConfirmation(true);
    } else {
      alert("Please select songs to delete.");
    }
  };
  const theme = useTheme();
  // const handleCellEdit = (params : any) => {
  //   console.log("params: ", params)
  //   // const updatedData = {
  //   //   id: params.id,
  //   //   field: params.field,
  //   //   value: params.props.value
  //   // };
  // }
  // 用于处理将歌曲添加到所选歌单的函数：
  const handleAddToAnotherList = async (targetList: { id: string, name: string }) => {
    const selectedCards = rows.filter(row => selectedRows.includes(row.id));
  
    for (const card of selectedCards) {
      try {
        createCard({
          song: card.song,
          singer: card.singer, 
          link: card.link,
          list_id: targetList.id,
        });
        await fetchCards();
      } catch (error) {
        console.error("Error adding card to another list:", error);
      }
    }

    // fetchCards();
    // fetchLists();
    setSelectedRows([]);
    setShowListSelector(false);
    await fetchCards();
    await fetchLists();
  };
  const handleConfirmDelete = async () => {
    const selectedCards = rows.filter(row => selectedRows.includes(row.id));
  
    for (const card of selectedCards) {
      try {
        await deleteCard(card.id); // Assuming card.id is the cardId you want to delete.
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  
   // console.log("selectedCards: ", selectedCards)
    const updatedRows = rows.filter((row) => !selectedRows.includes(row.id));
    setRows(updatedRows);
    setSelectedRows([]);
    setDeleteConfirmation(false);
  };
  const handleRowEdit = async (updatedRow: UpdateCardParams) => {
  
   // console.log("updatedRow: ", updatedRow, "originalRow: ", originalRow, "updatedRow.value: ", updatedRow.value)
    
    try {
      await updateCard(updatedRow.id, {
        song: updatedRow.song,
        singer: updatedRow.singer, 
        link: updatedRow.link,
        list_id: updatedRow.list_id,
      });
      await fetchCards();
    } catch (error) {
      console.error("Error updating card data:", error);
    }
    return updatedRow;
  }
  const handleProcessRowUpdateError = () => {

  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      //console.log("event: ",  event, "id: ", id)
      if (type === 'title'){
        
        if(!editableTitle.trim()) {
          alert('請輸入標題');
          return;
        }

        
        //else{
        try {
          // console.log("event: ",  event, "id: ", id)
          await updateList(id, { name:(event.target as HTMLInputElement).value
            , description:description, file:file });
          await fetchLists();
        } catch (error) {
          alert("Error: Failed to update list name");
        }
        //}
      }
      if (type === 'description'){
        
        if(!editableTitle.trim()) {
          alert('請輸入敘述');
          return;
        }
        else{
          try {
            await updateList(id, { description: (event.target as HTMLInputElement).value
              , name:title, file:file });
              await fetchLists();
          } catch (error) {
            alert("Error: Failed to update list description");
          }
        }
      }
      if (type === 'file'){
        
        if(!editableTitle.trim()) {
          alert('請上傳檔案');
          return;
        }
        else{
          try {
            await updateList(id, { file: (event.target as HTMLInputElement).value
              , name:title, description:description });
              await fetchLists();
          } catch (error) {
            alert("Error: Failed to update list file");
          }
        }
      }
     
    
      // onClose(); 
    }
  };
  const currentCards = currentList?.cards;

  useEffect(() => {
    setRows(currentCards || []);
  }, [lists, id, currentCards]);
  
  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ style: { height: '80vh' } }}>
    <Box display="flex">
  <div style={{ margin: '20px' }}>
  
    <img
      src={file}
      alt="List Cover"
      style={{ width: "150px", height: "150px", borderRadius: '30px' }}
    />
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, margin: '15px' }}>
    <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
      <input
        value={editableTitle}
        onChange={(e) => setEditableTitle(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'title')}
        style={{ fontSize: '1.5rem', border: 'none', outline: 'none', background: 'none', width: '100%' }}
      />
    </div>
    <div style={{ flex: 6 }}>
      <textarea
        value={editableDescription}
        onChange={(e) => setEditableDescription(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'description')}
        style={{ color: '#AAA', border: 'none', outline: 'none', background: 'none', width: '100%', height: '100%' }}
      />
    </div>
    <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
    <Button
        variant="contained"
        onClick={() => setOpenNewCardDialog(true)}
        sx={{
          marginRight: '8px',
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          }
        }}
      >
        <AddIcon className="mr-2" />
        Add 
      </Button>
      
      <Button
        variant="contained"
        onClick={() => setShowListSelector(true)}
        sx={{
          marginRight: '8px',
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          }
        }}
      >
        <AddIcon className="mr-2" />
        Add to another list
      </Button>

      <Button
        variant="contained"
        onClick={handleDeleteClick}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          }
        }}
      >
        <RemoveIcon className="mr-2" />
        Delete
      </Button>
    </div>
  </div>
</Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
        rowSelectionModel={selectedRows}
        processRowUpdate={(updatedRow) =>
          handleRowEdit(updatedRow)
        }
        onProcessRowUpdateError={handleProcessRowUpdateError}
        //editMode="cell"
        //onCellEditStop={handleCellEdit}
      />

    </Dialog>

    <CardDialog
      variant="new"
      open={openNewCardDialog}
      onClose={() => setOpenNewCardDialog(false)}
      listId={id}
    
    />
    <Dialog open={deleteConfirmation} onClose={() => setDeleteConfirmation(false)}>
  <Box p={2}>
    <Typography variant="h6">Confirm Deletion</Typography>
    <Typography component="div">
      Are you sure you want to delete the following songs?
      {selectedRows.map(id => {
        const song = rows.find(row => row.id === id);
        return <div key={id}>{song?.song}</div>;
      })}
    </Typography>

    <Button 
      onClick={handleConfirmDelete} 
      variant="contained" 
      color="primary" 
      style={{ marginRight: '8px' }}
    >
      Confirm
    </Button>
    <Button 
      onClick={() => setDeleteConfirmation(false)} 
      variant="contained" 
      color="primary"
    >
      Cancel
    </Button>
  </Box>
</Dialog>
{
  showListSelector && (
    <Dialog open={true} onClose={() => setShowListSelector(false)}>
      {lists.map(list => 
        list.id !== id ? (
          <Button key={list.id} onClick={() => handleAddToAnotherList(list)}>
            {list.name}
          </Button>
        ) : null
      )}
    </Dialog>

  )
}
  </>
  );
}
