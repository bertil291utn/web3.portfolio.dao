import styles from './SectionPanel.module.scss';

interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  id: string
}

const SectionPanel = ({ title, subtitle, children, className, id }: Props) => {
  return (
    <div className={`${className || ''} ${styles['container']}`} id={id}>
      <span className={styles['title']}>{title}</span>
      <span className={styles['subtitle']}>{subtitle}</span>
      <section className={styles['content']}>{children}</section>
    </div>
  );
};

export default SectionPanel;
