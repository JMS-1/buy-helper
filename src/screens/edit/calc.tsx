import { clsx } from 'clsx'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './calc.module.scss'

import { Button } from '../../components/button'
import { translations } from '../../stores'

interface ICalcProps {
    className?: string
    setUnitPrice(price: number): void
    unit: string
}

export const priceReg = /^\s*\d+(,\d{0,2})?\s*$/
export const amountReg = /^\s*\d+(,\d*)?\s*$/

export const Calc: React.FC<ICalcProps> = observer((props) => {
    const focus = React.useRef<HTMLInputElement>(null)

    const [open, setOpen] = React.useState(false)
    const [price, setPrice] = React.useState('')
    const [amount, setAmount] = React.useState('')

    const toggleOpen = React.useCallback(() => setOpen(!open), [open])

    React.useEffect(() => {
        if (open) {
            window.setTimeout(() => focus.current?.focus(), 100)
        }
    }, [focus, open])

    function onPrice(ev: React.ChangeEvent<HTMLInputElement>): void {
        setPrice(ev.currentTarget.value)
    }

    function onAmount(ev: React.ChangeEvent<HTMLInputElement>): void {
        setAmount(ev.currentTarget.value)
    }

    const currentPrice = priceReg.test(price) && parseFloat(price.replace(',', '.'))
    const currentAmount = amountReg.test(amount) && parseFloat(amount.replace(',', '.'))

    const pricePerUnit =
        typeof currentPrice === 'number' &&
        typeof currentAmount === 'number' &&
        currentAmount > 0 &&
        Math.round((100 * currentPrice) / currentAmount) / 100

    const { setUnitPrice } = props

    React.useEffect(() => {
        if (typeof pricePerUnit === 'number' && !isNaN(pricePerUnit) && isFinite(pricePerUnit)) {
            setUnitPrice(pricePerUnit)
        }
    }, [pricePerUnit, setUnitPrice])

    const { calc } = translations.strings

    return (
        <div className={clsx(styles.calc, props.className)}>
            <Button onClick={toggleOpen}>=</Button>
            {open && (
                <div className={styles.dialog}>
                    <h4>{calc.title}</h4>
                    <div>
                        <div>{calc.price}</div>
                        <input ref={focus} type='text' value={price} onChange={onPrice} />
                        <div>{calc.amount.replace(/\{unit\}/g, props.unit)}</div>
                        <input type='text' value={amount} onChange={onAmount} />
                    </div>
                </div>
            )}
        </div>
    )
})
