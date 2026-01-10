import React from 'react'
import styles from '../../ledger/LedgerPage.module.css'

interface SmartAmountInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export default function SmartAmountInput({
    value,
    onChange,
    placeholder = '+ 금액',
    className
}: SmartAmountInputProps) {
    const hasValue = value.trim().length > 0

    return (
        <div className={`${styles.smartInput} ${className || ''}`}>
            <input
                className={styles.smartInputField}
                value={value}
                onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ''))}
                aria-label={placeholder}
                inputMode="numeric"
                placeholder=""
            />
            <div className={styles.smartInputOverlay} aria-hidden="true">
                <span className={hasValue ? styles.smartInputValue : styles.smartInputPlaceholder}>
                    {hasValue ? value : placeholder}
                </span>
                <span className={styles.smartInputSuffix}>0000</span>
            </div>
        </div>
    )
}
