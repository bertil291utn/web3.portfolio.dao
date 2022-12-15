import styles from './SectionPanel.module.scss';

const SectionPanel = ({ title, subtitle, children, className, id }) => {
  return (
    <div className={`${className || ''} ${styles['container']}`} id={id}>
      <span className={styles['title']}>{title}</span>
      <span className={styles['subtitle']}>{subtitle}</span>
      <section className={styles['content']}>{children}</section>
    </div>
  );
};

export default SectionPanel;
