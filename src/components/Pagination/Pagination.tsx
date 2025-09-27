import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export default function Pagination({
  pageCount,
  onPageChange,
}: {
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      className={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.prev}
      nextClassName={css.next}
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      onPageChange={(ev) => onPageChange(ev.selected + 1)} // selected с 0
    />
  );
}