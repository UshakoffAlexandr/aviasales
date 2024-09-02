import { useDispatch, useSelector } from 'react-redux';
import { setSortValue } from '../../store/ticketsSlice';

import classes from './Sort.module.scss';

export default function Sort() {
  const dispatch = useDispatch();
  const isActive = useSelector((state) => state.tickets.sortValue);

  const sortNames = ['Самый дешевый', 'Самый быстрый'];
  return (
    <div className={classes.sort}>
      {sortNames.map((sort) => (
        <label
          key={sort}
          className={classes['sort-item']}
          style={isActive === sort ? { color: 'white', backgroundColor: '#2196f3' } : null}
        >
          <input
            type="radio"
            name="sort-radio"
            className={classes['sort-item__radio']}
            value={sort}
            onChange={() => dispatch(setSortValue({ sort }))}
          />
          {sort}
        </label>
      ))}
    </div>
  );
}
