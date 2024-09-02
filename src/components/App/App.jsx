import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchTickets } from '../../store/ticketsSlice';

import logo from '../../img/aviasales-logo.svg';
import Filters from '../Filters/Filters';
import Sort from '../Sort/Sort';
import TicketsList from '../TicketsList/TicketsList';

import classes from './App.module.scss';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTickets()).catch(() => dispatch(fetchTickets()));
  }, [dispatch]);

  return (
    <section className={classes.app}>
      <header className={classes.header}>
        <img src={logo} alt="Aviasales" />
      </header>
      <aside>
        <Filters />
      </aside>
      <main className={classes.main}>
        <Sort />
        <TicketsList />
      </main>
    </section>
  );
}
