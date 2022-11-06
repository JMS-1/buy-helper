import { clsx } from 'clsx'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'

import { Calc, priceReg } from './calc'
import styles from './form.module.scss'

import { Button } from '../../components/button'
import { data, translations } from '../../stores'

interface IFormProps {
    className?: string
}

function priceToText(price: number | string): string {
    if (typeof price !== 'number') {
        return price
    }

    return ` ${price}`.replace(/\./g, ',')
}

export const Form: React.FC<IFormProps> = observer((props) => {
    const { editId, all } = data

    const [confirm, setConfirm] = React.useState(false)

    const edit = React.useMemo(
        () =>
            observable(all.find((a) => a.id === editId) || { id: '', name: '', unit: 'kg', unitPrice: 1, variant: '' }),
        [all, editId]
    )

    const setName = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.name = ev.target.value || ''
    }

    const setVariant = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.variant = ev.target.value || ''
    }

    const setUnit = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.unit = ev.target.value || ''
    }

    const setPrice = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirm(false)

        edit.unitPrice = (ev.target.value || '') as unknown as number
    }

    const setCalcPrice = (price: number): void => {
        setConfirm(false)

        edit.unitPrice = price
    }

    const { name, unit, unitPrice } = edit

    const canSave = React.useMemo(
        () => name && unit && (typeof unitPrice === 'number' || priceReg.test(unitPrice)),
        [name, unit, unitPrice]
    )

    const onCancel = React.useCallback(() => (data.editId = undefined), [])

    const onSave = React.useCallback(() => data.addOrUpdate(edit), [edit])

    const onRemove = React.useCallback(() => {
        if (confirm) {
            data.remove(edit)
        } else {
            setConfirm(true)
        }
    }, [edit, confirm])

    return (
        <div className={clsx(styles.form, props.className)}>
            <h1>{translations.strings.form}</h1>
            <div>
                <label>
                    <span>{translations.strings.name}</span>
                    <input type='text' value={edit.name} onChange={setName} />
                </label>
                <label>
                    <span>{translations.strings.variant}</span>
                    <input type='text' value={edit.variant} onChange={setVariant} />
                </label>
                <label>
                    <span>
                        {translations.strings.price}
                        <input type='text' value={edit.unit} onChange={setUnit} />
                        <Calc setUnitPrice={setCalcPrice} unit={edit.unit} />
                    </span>
                    <input size={4} type='text' value={priceToText(edit.unitPrice)} onChange={setPrice} />
                </label>
                <div>
                    <Button onClick={onCancel}>{translations.strings.cancel}</Button>
                    <Button disabled={!canSave} onClick={onSave}>
                        {translations.strings.save}
                    </Button>
                    {editId && (
                        <Button bad={confirm} onClick={onRemove}>
                            {confirm ? translations.strings.confirm : translations.strings.remove}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
})
