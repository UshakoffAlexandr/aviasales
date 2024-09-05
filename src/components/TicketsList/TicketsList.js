import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import uniqid from 'uniqid';
import { setFoneLoading } from '../../store/ticketsSlice';

import classes from './TicketsList.module.scss';
import Ticket from '../Ticket/Ticket';

export default function TicketsList() {
  const dispatch = useDispatch();
  const isTicketsLoad = useSelector((state) => state.tickets.isTicketsLoad);
  const isFoneLoading = useSelector((state) => state.tickets.isFoneLoading);
  const tickets = useSelector((state) => state.tickets.tickets);
  const sortValue = useSelector((state) => state.tickets.sortValue);
  const filters = useSelector((state) => state.tickets.filters);

  const [showTicketsLimit, setShowTicketsLimit] = useState(5);

  useEffect(() => {
    if (!isTicketsLoad) {
      dispatch(setFoneLoading(false));
    }
  }, [isTicketsLoad, dispatch]);

  const filteredTickets = useMemo(() => {
    const selectedFilters = filters
      .filter((filter) => filter.isChecked && filter.id !== 'all')
      .map((filter) => filter.id);

    let filtered = tickets.filter((ticket) =>
      ticket.segments.some((segment) => selectedFilters.includes(segment.stops.length))
    );

    if (sortValue === 'Самый дешевый') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'Самый быстрый') {
      filtered = filtered.sort((a, b) => a.segments[0].duration - b.segments[0].duration);
    }

    return filtered;
  }, [tickets, sortValue, filters]);

  const limitedTickets = useMemo(() => filteredTickets.slice(0, showTicketsLimit), [filteredTickets, showTicketsLimit]);

  const handleShowMore = () => setShowTicketsLimit(showTicketsLimit + 5);

  const content = (
    <>
      <ul>
        {limitedTickets.map((ticket) => (
          <li key={uniqid(`${ticket.carrier}`)} className={classes.ticket}>
            <Ticket ticket={ticket} />
          </li>
        ))}
      </ul>
      {filteredTickets.length > showTicketsLimit && (
        <button type="button" className={classes['show-more-btn']} onClick={handleShowMore}>
          Показать ещё 5 билетов!
        </button>
      )}
    </>
  );

  const noRes = <div className={classes['no-results-message']}>Билетов под заданные фильтры не найдено</div>;

  const loader = (
    <div className={classes['tickets-list__loader']}>{isTicketsLoad ? 'Загрузка билетов...' : 'Билеты загружены'}</div>
  );

  return (
    <div className={classes.container}>
      {loader}
      {!isFoneLoading && !filteredTickets.length ? noRes : content}
    </div>
  );
}
