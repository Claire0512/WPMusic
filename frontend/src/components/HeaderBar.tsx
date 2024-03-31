// import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
// import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function HeaderBar() {
  return (
    <AppBar position="static" color="secondary">
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
          WP Music
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
