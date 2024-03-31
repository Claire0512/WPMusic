import { useRef} from "react";
import { useTheme } from '@mui/material/styles';

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
// import AddIcon from "@mui/icons-material/Add";
import useCards from "@/hooks/useCards";
import { createList } from "@/utils/client";

// import * as React from 'react';
import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// import InputFileUpload from "./file";
type NewListDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function NewListDialog({ open, onClose }: NewListDialogProps) {
  // using a ref to get the dom element is one way to get the value of a input
  // another way is to use a state variable and update it on change, which can be found in CardDialog.tsx
  // const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  // const textfieldRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  //const { fetchLists } = useCards();
  const theme = useTheme();
  const { lists, fetchLists } = useCards();
  const handleAddList = async () => {
    if(!nameRef.current?.value){
      alert("Error: 請輸入標題！");
      // onClose();
      return;
    }
    if(!descriptionRef.current?.value){
      alert("Error: 請輸入敘述！");
      // onClose();,
      return;
    }
    
    const selectedFile = fileRef.current?.files?.[0];

    if (!selectedFile) {
      alert("Error: 請上傳清單圖片(.jpg)！");
      return;
    }
  
    // Move the existingList check inside the function
    const existingList = lists.find(list => list.name === nameRef.current?.value);

    if (existingList) {
      alert("Error: List name already exists");
      return;
    }

    const readFileAsDataURL = (file: Blob): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
          resolve(event.target?.result as string);
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    };
    
    try {

      const base64Data = await readFileAsDataURL(selectedFile);
    
      await createList({
        name: nameRef.current?.value ?? "",
        description: descriptionRef.current?.value ?? "",
        file: base64Data, // 儲存 base64 圖片數據
      });
     // console.log("nameRef.current?.value: ", nameRef.current?.value, "descriptionRef.current?.value: ", descriptionRef.current?.value)
     await fetchLists();
    } catch (error) {
      alert("Error: Failed to create list");
    } finally {
      onClose();
    }
    
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a list</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={nameRef}
          label="List Name"
          variant="outlined"
          sx={{ mt: 2 }}
          
          autoFocus
        />
      </DialogContent>
      <DialogTitle>Add a description</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={descriptionRef}
          label="List Description"
          variant="outlined"
          sx={{ mt: 2 }}
          autoFocus
        />
      </DialogContent>
      <DialogTitle>Add a file</DialogTitle>
      {/* <DialogContent> */}
 
      {/* <DialogTitle>Add a file</DialogTitle> */}
<DialogContent>
  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}  sx={{
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          }
        }}>
    Upload file
    <VisuallyHiddenInput 
      type="file" 
      ref={fileRef} 
      accept=".jpg" 
    />

  </Button>
</DialogContent>

      {/* </DialogContent> */}
      <DialogActions>
        <Button onClick={handleAddList} sx={{
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          }
        }}>add</Button>
        <Button onClick={onClose} sx={{
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          }
        }}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
