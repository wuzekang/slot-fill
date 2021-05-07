import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import clsx from 'clsx';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { createSlot, SlotFillProvider } from 'slot-fill';

const FabSlot = createSlot();

interface TabPanelProps extends TypographyProps<'div'> {
  value: number;
  index: number;
  fab?: React.ReactElement;
  children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, fab, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <>
          <Box p={3}>{children}</Box>
          {fab && (
            <FabSlot.Fill>
              <Zoom>{fab}</Zoom>
            </FabSlot.Fill>
          )}
        </>
      )}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
}));

export default function FloatingActionButtonZoom() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <SlotFillProvider>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="action tabs example"
          >
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs>
        </AppBar>
        <TabPanel
          value={value}
          index={0}
          fab={
            <Fab aria-label="Add" className={classes.fab} color="primary">
              <AddIcon />
            </Fab>
          }
        >
          Item One
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          fab={
            <Fab aria-label="Edit" className={classes.fab} color="secondary">
              <EditIcon />
            </Fab>
          }
        >
          Item Two
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          fab={
            <Fab
              aria-label="Expand"
              className={clsx(classes.fab, classes.fabGreen)}
              color="inherit"
            >
              <UpIcon />
            </Fab>
          }
        >
          Item Three
        </TabPanel>
        <FabSlot>
          {(children) => <TransitionGroup>{children}</TransitionGroup>}
        </FabSlot>
      </div>
    </SlotFillProvider>
  );
}
