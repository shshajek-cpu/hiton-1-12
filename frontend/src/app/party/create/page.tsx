'use client'

import Link from 'next/link'
import CreatePartyForm from '../components/CreatePartyForm'
import MyCharacters from '../components/MyCharacters'
import styles from './page.module.css'

export default function CreatePartyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/party" className={styles.backLink}>
          ← 목록
        </Link>
        <h1 className={styles.title}>파티 모집하기</h1>
      </div>

      <MyCharacters />

      <CreatePartyForm />
    </div>
  )
}
