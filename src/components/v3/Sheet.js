import { Note } from './Marks';

/** One page of the notebook: a margin column with a handwritten note, then the content. */
export default function Sheet({ id, note, children, className = '' }) {
  return (
    <section id={id} className="wrap">
      <div className={'sheet ' + className}>
        <Note>{note}</Note>
        <div className="body">{children}</div>
      </div>
    </section>
  );
}
