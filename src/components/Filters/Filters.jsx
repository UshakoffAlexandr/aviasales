import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/ticketsSlice';

import classes from './Filters.module.scss';

export default function Filters() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.tickets.filters);

  return (
    <div className={classes.aside}>
      <h3 className={classes['filters-title']}>КОЛИЧЕСТВО ПЕРЕСАДОК</h3>
      <ul className={classes.filters}>
        {filters.map((filter) => (
          <li key={filter.id} className={classes.filter}>
            <input
              type="checkbox"
              id={filter.id}
              className={classes['checkbox-custom']}
              checked={filter.isChecked}
              onChange={(e) => dispatch(setFilter({ id: filter.id, isChecked: e.target.checked }))}
            />
            <label htmlFor={filter.id}>{filter.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
