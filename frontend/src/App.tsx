import { useEffect, useState } from "react";
import { Button } from "@mui/material";

import CardList from "@/components/CardList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import useCards from "@/hooks/useCards";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';
import { styled} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useTheme } from '@mui/material/styles';
import type { ChangeEvent } from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  marginLeft: 0,
  width: '100%',
  height: '40px',  
  // [theme.breakpoints.up('sm')]: {
  //   marginLeft: theme.spacing(1),
  //   width: 'auto',
  // },
 
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
   // transition: theme.transitions.create('width'),
    width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //   width: '12ch',
    //   '&:focus': {
    //     width: '20ch',
    //   },
    // },
  },
}));


function App() {
  const { lists, fetchLists, fetchCards } = useCards();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [deleting, setIsDeleting] = useState(false);
  const [deleteButtonText, setDeleteButtonText] = useState("Delete");
  const [searchTerm, setSearchTerm] = useState(""); 
  const theme = useTheme();
  // const [localSearchTerm, setLocalSearchTerm] = useState(""); // 追踪輸入框的值

  // 當輸入框的值改變時，只更新 localSearchTerm
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

 
  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchLists, fetchCards]);

  const filteredLists = searchTerm
    ? lists.filter(list => 
        list.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : lists;

    
 
  return (
    <div style={{ backgroundColor: theme.palette.primary.main, minHeight: '100vh' }}>
      <HeaderBar />
      
      <AppBar position="static" color="primary">

        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{
              ml: 4,
              flexGrow: 1,
              fontFamily: 'monospace',
            }}
          >
            My Playlists
          </Typography>
          <Box
          
            sx={{
              mr: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end', 
              gap: '8px', 
            }}
          >
             <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleInputChange}
              // onKeyDown={handleInputKeyDown}  // Use onKeyDown here
              value={searchTerm}
            />
            </Search>
            <Button 
              onClick={() => setNewListDialogOpen(true)}
              variant="contained"
              sx={{ 
                  fontSize: '16px', 
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                  }
              }}
            >
                ADD
            </Button>
                        
            <Button 
                onClick={() => {
                    if (deleteButtonText === "Delete") {
                        setDeleteButtonText("Done");
                        setIsDeleting(true); 
                    } else {
                        setDeleteButtonText("Delete");
                        setIsDeleting(false); 
                    }
                }}
                variant="contained"
                sx={{ 
                    fontSize: '16px', 
                    backgroundColor: theme.palette.secondary.main,
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                    }
                }}
            >
                {deleteButtonText}
            </Button>

              
          </Box>
        </Toolbar>
      </AppBar>

  
      <main className="mx-auto flex flex-col px-24 py-12" style={{ backgroundColor: theme.palette.primary.main }}>
  <div className="flex flex-wrap">
    {filteredLists.map((list) => (
      <CardList key={list.id} {...list} deleting={deleting} />
    ))}
  </div>
  
  <NewListDialog
    open={newListDialogOpen}
    onClose={() => setNewListDialogOpen(false)}
  />
</main>





    </div>
  );
}

export default App;
