"use client";
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Typography, Button, Modal, Stack, TextField, Paper, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { collection, getDocs, query, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async () => {
    if (!itemName.trim()) return; // Check if itemName is not empty
    const docRef = doc(firestore, 'inventory', itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const newCount = data.count + 1;
      await updateDoc(docRef, { count: newCount });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updateInventory();
    setItemName(''); // Reset itemName after adding
    handleClose(); // Close the modal after adding
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.count > 1) {
        await updateDoc(docRef, { count: data.count - 1 });
      } else {
        await deleteDoc(docRef);
      }
      await updateInventory();
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
      sx={{
        backgroundColor: '#f0f4f8',
        padding: 4,
      }}
    >
      <Typography variant="h2" color="primary" gutterBottom>
        Inventory Management
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          width: '60%',
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Add Item
        </Typography>
        <Stack width="100%" direction="row" spacing={2} justifyContent="center">
          <TextField
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            label="Item Name"
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={addItem}>
            Add
          </Button>
        </Stack>
      </Paper>

      <Box mt={4} width="60%" display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginBottom: 2,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Inventory"
            inputProps={{ 'aria-label': 'search inventory' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {filteredInventory.map((item) => (
          <Paper
            key={item.id}
            elevation={2}
            sx={{
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#e3f2fd',
              borderRadius: 2,
              width: '100%',
            }}
          >
            <Typography variant="h5" color="textPrimary">
              {item.id}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Count: {item.count}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="secondary" onClick={() => addItem(item.id)}>
                Add
              </Button>
              <Button variant="outlined" color="error" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="50%"
          bgcolor="white"
          p={4}
          borderRadius={2}
          boxShadow={24}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <TextField
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            label="Item Name"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={addItem}>
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
