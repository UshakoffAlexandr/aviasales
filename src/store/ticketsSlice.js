import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async (_, { dispatch }) => {
  const base = 'https://aviasales-test-api.kata.academy';
  let shouldContinue = true;
  const ticketsArr = [];

  const searchIdRes = await fetch(`${base}/search`);
  const { searchId } = await searchIdRes.json();

  while (shouldContinue) {
    try {
      const ticketsRes = await fetch(`${base}/tickets?searchId=${searchId}`);
      const ticketsData = await ticketsRes.json();
      ticketsArr.push(...ticketsData.tickets);
      if (ticketsArr.length === 500) {
        dispatch(addTickets(ticketsData.tickets));
        dispatch(setFoneLoading(true));
      }
      shouldContinue = !ticketsData.stop;
    } catch {}
  }

  return ticketsArr;
});

const filters = [
  { id: 'all', name: 'Все', isChecked: false },
  { id: 0, name: 'Без пересадок', isChecked: true },
  { id: 1, name: '1 пересадка', isChecked: true },
  { id: 2, name: '2 пересадки', isChecked: true },
  { id: 3, name: '3 пересадки', isChecked: false },
];

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    filteredTickets: [],
    sortValue: 'Самый дешевый',
    filters,
    isTicketsLoad: false,
    isFoneLoading: null,
  },
  reducers: {
    addTickets(state, action) {
      state.tickets.push(...action.payload);
      state.filteredTickets = state.tickets;
    },
    setSortValue(state, action) {
      state.sortValue = action.payload.sort;
    },

    setFilter(state, action) {
      const { id, isChecked } = action.payload;
      if (id === 'all') {
        state.filters.forEach((filter) => {
          filter.isChecked = isChecked;
        });
      } else {
        const filter = state.filters.find((f) => f.id === id);
        filter.isChecked = isChecked;
        const allFilter = state.filters.find((f) => f.id === 'all');
        allFilter.isChecked = state.filters.filter((f) => f.id !== 'all').every((f) => f.isChecked);
      }
    },

    filterTickets(state) {
      const selectedFilters = state.filters
        .filter((filter) => filter.isChecked && filter.id !== 'all')
        .map((filter) => filter.id);

      state.filteredTickets = state.tickets.filter((ticket) =>
        ticket.segments.some((segment) => selectedFilters.includes(segment.stops.length))
      );

      if (state.sortValue === 'Самый дешевый') {
        state.filteredTickets.sort((a, b) => a.price - b.price);
      }

      if (state.sortValue === 'Самый быстрый') {
        state.filteredTickets.sort((a, b) => a.segments[0].duration - b.segments[0].duration);
      }
    },
    setFoneLoading(state, action) {
      state.isFoneLoading = action.payload.isFoneLoading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTickets.pending, (state) => {
      state.isTicketsLoad = true;
      state.isFoneLoading = false;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.tickets = action.payload;
      state.isTicketsLoad = false;
    });
  },
  serializeCheck: false,
});

export const { addTickets, setSortValue, setFilter, filterTickets, setFoneLoading } = ticketsSlice.actions;
export default ticketsSlice.reducer;
