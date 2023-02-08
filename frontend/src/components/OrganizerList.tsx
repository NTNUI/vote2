import { Box } from '@mantine/core';
import { throws } from 'assert';
import { useState } from 'react';
import { getGroups } from '../services/organizer';

//const [organizedGroups, setOrganizedGroups] = useState(0);

async function sortGroups(){
    try{
        const groups = await getGroups();
        console.log(groups);
    }
    catch (error){
        console.log(error)
    }
}
export function OrganizerList() {
    
    sortGroups();
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        cursor: 'pointer',

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },
      })}
    >
      Box lets you add inline styles with sx prop
    </Box>
  );
}