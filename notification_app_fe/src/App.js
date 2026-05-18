import React, {
  useEffect,
  useState
} from 'react';

import {
  Container,

  CircularProgress,
  Grid,
  Typography
} from '@mui/material';
import NotificationCard from './components/NotificationCard';
import FilterBar from './components/FilterBar';
import PaginationBar from './components/PaginationBar';
import PriorityInbox from './components/PriorityInbox';

import { fetchNotifications } from './services/api';

function App() {

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);

      const data = await fetchNotifications(
        page,
        10,
        filter
      );

      setNotifications(data);
      setLoading(false);
    };

    loadNotifications();
  }, [page, filter]);

  return (

    <Container sx={{ marginTop: 4 }}>

      <PriorityInbox />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
      />

      {
        loading ? (

          <CircularProgress />

        ) : notifications.length === 0 ? (

          <Typography>
            No Notifications Found
          </Typography>

        ) : (

          <Grid container spacing={2}>

            {
              notifications.map((item) => (

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={item.ID}
                >

                  <NotificationCard item={item} />

                </Grid>
              ))
            }

          </Grid>
        )
      }

      <PaginationBar
        page={page}
        setPage={setPage}
      />

    </Container>
  );
}

export default App;