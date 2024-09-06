import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import uniqid from 'uniqid';

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async (_, { dispatch, rejectWithValue }) => {
  const base = 'https://aviasales-test-api.kata.academy';
  let shouldContinue = true;
  const ticketsArr = [];

  try {
    const searchIdRes = await fetch(`${base}/search`);
    const { searchId } = await searchIdRes.json();

    while (shouldContinue) {
      try {
        const ticketsRes = await fetch(`${base}/tickets?searchId=${searchId}`);
        if (!ticketsRes.ok) {
          if (ticketsRes.status >= 500) {
            throw new Error('Ошибка получения данных с сервера');
          } else {
            shouldContinue = false;
            return rejectWithValue('Ошибка при получении данных');
          }
        }
        const ticketsData = await ticketsRes.json();
        const { tickets, stop } = ticketsData;

        if (!tickets || !Array.isArray(tickets)) {
          throw new Error('Некорректный формат данных от сервера');
        }

        const ticketsWithId = tickets.map((ticket) => ({
          ...ticket,
          id: uniqid(ticket.carrier),
        }));

        dispatch(addTickets(ticketsWithId));
        dispatch(setFoneLoading(true));

        if (stop) {
          shouldContinue = false;
        }
      } catch (error) {
        if (error.message === 'Ошибка получения данных с сервера') {
          // Повторная попытка запроса из-за ошибки сервера
        } else {
          shouldContinue = false;
          return rejectWithValue(error.message);
        }
      }
    }

    return ticketsArr;
  } catch (error) {
    return rejectWithValue('Ошибка при получении Search ID');
  }
});

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    sortValue: 'Самый дешевый',
    filters: [
      { id: 'all', name: 'Все', isChecked: false },
      { id: 0, name: 'Без пересадок', isChecked: true },
      { id: 1, name: '1 пересадка', isChecked: true },
      { id: 2, name: '2 пересадки', isChecked: true },
      { id: 3, name: '3 пересадки', isChecked: false },
    ],
    isTicketsLoad: false,
    isFoneLoading: null,
    errorMessage: null,
  },
  reducers: {
    addTickets(state, action) {
      state.tickets.push(...action.payload);
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
    setFoneLoading(state, action) {
      state.isFoneLoading = action.payload;
    },
    clearErrorMessage(state) {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTickets.pending, (state) => {
      state.isTicketsLoad = true;
      state.isFoneLoading = false;
    });
    builder.addCase(fetchTickets.fulfilled, (state) => {
      state.isTicketsLoad = false;
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.isTicketsLoad = false;
      state.errorMessage = action.payload;
    });
  },
});

export const { addTickets, setSortValue, setFilter, setFoneLoading, clearErrorMessage } = ticketsSlice.actions;
export default ticketsSlice.reducer;
