import ButtonComponent from '@components/common/Button.component';
import { Router, useRouter } from 'next/router';
import styles from '../css/error.module.scss';

export default function Custom404() {
  const router = useRouter();
  return (
    <div className={styles['container']}>
      <h1>An error has ocurred</h1>
      <ButtonComponent
        className={styles['button']}
        buttonType='primary'
        btnLabel={'Go to home'}
        onClick={() => router.push('/')}
      />
    </div>
  )
}