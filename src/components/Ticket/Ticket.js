import { format, add } from 'date-fns';
import classes from './Ticket.module.scss';

export default function Ticket({ ticket }) {
  const sending = (segment) => format(new Date(segment.date), 'HH:mm');

  const arrival = (segment) =>
    format(
      add(new Date(segment.date), {
        minutes: segment.duration,
      }),
      'kk:mm'
    );

  const stops = (segment) => segment.stops.map((name) => name).join(', ');

  const stopsTitle = (num) => {
    switch (num) {
      case 0:
        return '0 ПЕРЕСАДОК';
      case 1:
        return '1 ПЕРЕСАДКА';
      default:
        return `${num} ПЕРЕСАДКИ`;
    }
  };

  return (
    <>
      <div className={classes['ticket-header']}>
        <span className={classes.price}>{ticket.price}</span>
        <img src={`https://pics.avs.io/110/36/${ticket.carrier}.png`} alt="flight company logo" />
      </div>

      <div className={classes['flight-info']}>
        <div className={classes.block}>
          <span className={classes.title}>
            {ticket.segments[0].origin} - {ticket.segments[0].destination}
          </span>
          <span className={classes.desc}>
            {sending(ticket.segments[0])} - {arrival(ticket.segments[0])}
          </span>
        </div>
        <div className={classes.block}>
          <span className={classes.title}>В ПУТИ</span>
          <span
            className={classes.desc}
          >{`${Math.floor(ticket.segments[0].duration / 60)}ч ${ticket.segments[0].duration % 60}м`}</span>
        </div>
        <div className={classes.block}>
          <span className={classes.title}>{stopsTitle(ticket.segments[0].stops.length)}</span>
          <span className={classes.desc}>{stops(ticket.segments[0])}</span>
        </div>
      </div>

      <div className={classes['flight-info']}>
        <div className={classes.block}>
          <span className={classes.title}>
            {ticket.segments[1].origin} - {ticket.segments[1].destination}
          </span>
          <span className={classes.desc}>
            {sending(ticket.segments[1])} - {arrival(ticket.segments[1])}
          </span>
        </div>
        <div className={classes.block}>
          <span className={classes.title}>В ПУТИ</span>
          <span
            className={classes.desc}
          >{`${Math.floor(ticket.segments[1].duration / 60)}ч ${ticket.segments[1].duration % 60}м`}</span>
        </div>
        <div className={classes.block}>
          <span className={classes.title}>{stopsTitle(ticket.segments[1].stops.length)}</span>
          <span className={classes.desc}>{stops(ticket.segments[1])}</span>
        </div>
      </div>
    </>
  );
}
