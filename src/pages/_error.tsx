import ButtonComponent from '@components/common/Button.component';
import { PageLabel } from '@placeholders/error.placeholders';
import { Router, useRouter } from 'next/router';
import styles from '../css/error.module.scss';

export default function Custom404() {
  const router = useRouter();
  return (
    <div className={styles['container']}>
      <h1>{PageLabel.title}</h1>
      <ButtonComponent
        className={styles['button']}
        onClick={() => router.push('/')}
      >
        {PageLabel.btnLabel}
      </ButtonComponent>
    </div>
  )
}