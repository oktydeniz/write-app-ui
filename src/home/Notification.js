import { getInvitations,respondToInvitation } from "network/NotificationService";
import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';

const Notification = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const result = await getInvitations();
        setInvitations(result.response);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchInvitations();
  },[]);

  const handleResponse = async (inviteId, responseType) => {
    try {
      setInvitations((prevInvitations) =>
        prevInvitations.map((invite) =>
          invite.id === inviteId ? { ...invite, status: responseType } : invite
        )
      );
      var data = {
        inviteId,
        responseType
      }
      await respondToInvitation(data);
    } catch (error) {
      console.error(`Error responding to invitation ${responseType}:`, error);
    }
  };

  return (
    <div>
    <h1>Bildirimler</h1>
    <List>
      {invitations.map((invite) => (
        <ListItem key={invite.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ListItemText
            primary={`Davet Eden: ${invite.inviter.userName} (${invite.inviter.userAppName})`}
            secondary={`İçerik: ${invite.content.name}`}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleResponse(invite.id, 1)}
              disabled={invite.status !== 'PENDING'}
            >
              Kabul Et
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleResponse(invite.id, 2)}
              disabled={invite.status !== 'PENDING'}
            >
              Reddet
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  </div>
  );
};

export default Notification;
