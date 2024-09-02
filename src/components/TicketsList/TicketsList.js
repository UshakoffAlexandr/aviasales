import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import uniqid from 'uniqid';
import { filterTickets, setFoneLoading } from '../../store/ticketsSlice';

import classes from './TicketsList.module.scss';

import Ticket from '../Ticket/Ticket';

export default function TicketsList() {
  const dispatch = useDispatch();
  const isTicketsLoad = useSelector((state) => state.tickets.isTicketsLoad);
  const isFoneLoading = useSelector((state) => state.tickets.isFoneLoading);
  const filteredTickets = useSelector((state) => state.tickets.filteredTickets);
  const sortValue = useSelector((state) => state.tickets.sortValue);
  const filters = useSelector((state) => state.tickets.filters);

  const [showTicketsLimit, setShowTicketsLimit] = useState(5);

  useEffect(() => {
    if (!isTicketsLoad) {
      dispatch(setFoneLoading(false));
    }
    dispatch(filterTickets());
  }, [sortValue, filters, isTicketsLoad]);

  const limitTicketsViewCount = (tickets, limit) => tickets.slice(0, limit);
  const limitedTickets = limitTicketsViewCount(filteredTickets, showTicketsLimit);

  const handleShowMore = () => {
    setShowTicketsLimit(showTicketsLimit + 5);
  };

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
